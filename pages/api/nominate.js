// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** Next Auth Import
import { getToken } from 'next-auth/jwt'

// ** Twitter Import
import Twitter from 'twitter-lite'

export default async function handler(req, res) {

    // Request Variables
    const { method } = req
    let { seniorScout1, seniorScout2, member, type } = req.query

    seniorScout1 = seniorScout1.replace('@', '').replace(/\s+/g, '')
    seniorScout2 = seniorScout2.replace('@', '').replace(/\s+/g, '')
    member = member.replace('@', '').replace(/\s+/g, '')
    type = type.trim()

    // Verify that user has a valid session
    const token = await getToken({ req })
    if (!token)
        return res.status(401).json({ message: 'Invalid User Request!' })

    // Connect to Database
    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            // Verify Input Data (Type)
            if (type !== "Member" && type !== "Senior Scout")
                return res.status(400).json({ message: "Invalid Type!" })

            // Verify Input Data (Senior Scout)
            if (type === "Senior Scout" && (!seniorScout1 || !seniorScout2 || (seniorScout1 === seniorScout2)))
                return res.status(400).json({ message: 'Please submit two Senior Scout nominations!' })

            // Verify Input Data (Member) 
            if ((type === "Member" && !member) || type === "Member" && member === "")
                return res.status(400).json({ message: 'Please submit a Member nomination!' })

            // Get User Data
            const user = await db.collection('members').findOne({ twitterHandle: token.userProfile.twitterHandle })

            // Verify API request came from a valid user
            if (!user || user.status !== "accepted")
                return res.status(401).json({ message: 'Invalid Request!' })

            // Verify nomination type is allowed by user role
            if ((type === "Senior Scout" && user.role !== "Elite Scout") || (type === "Member" && user.role !== "Senior Scout"))
                return res.status(400).json({ message: 'Your role does not allow you to nominate for this role!' })

            // Get Team Data
            const team = await db.collection('teams').findOne({ _id: user.teamId })

            // Get Team Members Data
            const teamMembers = await db.collection('members').find({ teamId: team._id }).toArray()

            // Set Current Team Member Counts
            const seniorScouts = teamMembers.filter(obj => obj.role === "Senior Scout").length
            const nominatedMembers = teamMembers.filter(obj => obj.role === "Member" && obj.nominatedBy === user.twitterHandle).length
            const members = teamMembers.filter(obj => obj.role === "Member").length

            // Verify Maximum Team Member Counts
            if ((type === "Senior Scout" && seniorScouts > 1) || (type === "Member" && (members > 2 || nominatedMembers > 0)))
                return res.status(400).json({ message: `You have no ${type} nomination seats remaining!` })

            // Verify nomination does not include existing nominees
            const verifyNominees = await db.collection('members').find({
                $or: [
                    { twitterHandle: seniorScout1 },
                    { twitterHandle: seniorScout2 },
                    { twitterHandle: member }
                ]
            }).collation({ locale: 'en', strength: 1 }).toArray()

            // If nomination includes existing nominees, return error response
            if (verifyNominees.length > 0) {
                let errorString = "Your nomination"

                if (verifyNominees.length > 1) {
                    errorString = errorString + "s, "
                } else {
                    errorString = errorString + ", "
                }

                verifyNominees.forEach(function (v, i) {
                    errorString = errorString + v.twitterHandle
                    if (i + 1 === verifyNominees.length - 1) {
                        errorString = errorString + ' and '
                    } else {
                        errorString = errorString + ', '
                    }
                })

                if (verifyNominees.length > 1) {
                    errorString = errorString + ' have'
                } else {
                    errorString = errorString + ' has'
                }

                errorString = errorString + ' already been nominated by someone else!'

                return res.status(400).json({ message: errorString })
            }

            // Insert nominations
            let insert
            let insertData

            if (type === "Senior Scout") {
                insertData = [
                    {
                        role: type,
                        twitterHandle: seniorScout1,
                        nominatedBy: token.userProfile.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    },
                    {
                        role: type,
                        twitterHandle: seniorScout2,
                        nominatedBy: token.userProfile.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    },
                ]
                insert = await db.collection('members').insertMany(insertData)
            } else if (type === "Member") {
                insertData = [
                    {
                        role: type,
                        twitterHandle: member,
                        nominatedBy: token.userProfile.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    }
                ]
                insert = await db.collection('members').insertOne(insertData[0])
            }

            // Trigger Twitter notification to Admins
            const t = new Twitter({
                consumer_key: process.env.LSDEVLABSAPP_TWITTER_API_KEY,
                consumer_secret: process.env.LSDEVLABSAPP_TWITTER_API_SECRET,
                access_token_key: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN_SECRET
            })

            const dmText = type === "Senior Scout" ? `New nominations received for @${seniorScout1} and @${seniorScout2}! Head to /admin/nominations to approve/reject them now!` : `New nomination received for @${member}! Head to /admin/nominations to approve/reject it now!`

            const parameters = {
                event: {
                    type: 'message_create',
                    message_create: {
                        target: {
                            recipient_id: '1509533708927205379'
                        },
                        message_data: {
                            text: dmText
                        }
                    }
                }
            }

            try {
                const resp = await t.post('direct_messages/events/new', parameters)
                console.log(resp)
            } catch (err) {
                console.log(err)
            }

            res.status(200).json({ insertData })

            break;

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}