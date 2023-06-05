// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

// ** Twitter Import
import Twitter from 'twitter-lite'
const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

// ** SendGrid Import
import sendgrid from '@sendgrid/mail'
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(req, res) {

    // Request Variables
    const { method } = req
    let { seniorScout1, seniorScout2, member, type } = req.query

    seniorScout1 = seniorScout1.replace('@', '').replace(/\s+/g, '')
    seniorScout2 = seniorScout2.replace('@', '').replace(/\s+/g, '')
    member = member.replace('@', '').replace(/\s+/g, '')
    type = type.trim()

    // Verify active sesion before proceeding
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ message: 'Twitter connection is required for this application!' })

    // Connect to Database
    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            const errors = []

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
            const user = await db.collection('scoutlist').findOne({ twitterId: session.twitter.twitterId })

            // Verify API request came from a valid user
            if (!user || user.status !== "accepted")
                return res.status(401).json({ message: 'Invalid Request!' })

            // Verify nomination type is allowed by user role
            if ((type === "Senior Scout" && user.role !== "Elite Scout") || (type === "Member" && user.role !== "Senior Scout"))
                return res.status(400).json({ message: 'Your role does not allow you to nominate for this role!' })

            // Get Team Data
            const team = await db.collection('teams').findOne({ _id: user.teamId })

            // Get Team Members Data
            const teamMembers = await db.collection('scoutlist').find({ teamId: team._id }).toArray()

            // Set Current Team Member Counts
            const seniorScouts = teamMembers.filter(obj => obj.role === "Senior Scout").length
            const nominatedMembers = teamMembers.filter(obj => obj.role === "Member" && obj.nominatedBy === user.twitterHandle).length
            const members = teamMembers.filter(obj => obj.role === "Member").length

            // Verify Maximum Team Member Counts
            if ((type === "Senior Scout" && seniorScouts > 1) || (type === "Member" && (members > 2 || nominatedMembers > 0)))
                return res.status(400).json({ message: `You have no ${type} nomination seats remaining!` })

            // Verify nomination does not include existing nominees
            const verifyNominees = await db.collection('scoutlist').find({
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
            let insertData

            if (type === "Senior Scout") {
                insertData = [
                    {
                        role: type,
                        twitterHandle: seniorScout1,
                        nominatedBy: session.twitter.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    },
                    {
                        role: type,
                        twitterHandle: seniorScout2,
                        nominatedBy: session.twitter.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    },
                ]
                await db.collection('scoutlist').insertMany(insertData)
            } else if (type === "Member") {
                insertData = [
                    {
                        role: type,
                        twitterHandle: member,
                        nominatedBy: session.twitter.twitterHandle,
                        status: 'nominated',
                        teamId: team._id,
                    }
                ]
                await db.collection('scoutlist').insertOne(insertData[0])
            }

            // // Create Twitter DM Notification Message for Admin User
            // const dmText = type === "Senior Scout" ? `New nominations received for @${seniorScout1} and @${seniorScout2}! Head to /admin/nominations to approve/reject them now!` : `New nomination received for @${member}! Head to /admin/nominations to approve/reject it now!`

            // const parameters = {
            //     event: {
            //         type: 'message_create',
            //         message_create: {
            //             target: {
            //                 recipient_id: '' // Enter Twitter ID
            //             },
            //             message_data: {
            //                 text: dmText
            //             }
            //         }
            //     }
            // }

            // try {
            //     const resp = await twitterClient.post('direct_messages/events/new', parameters)
            //     // console.log(resp)
            // } catch (err) {
            //     console.log(err)
            //     errors.push(err)
            // }

            try {
                await sendgrid.send({
                    to: 'thesportsmetaverse@gmail.com',
                    from: 'thescoutlist@gmail.com',
                    subject: `[Nomination Received from The Sports Metaverse]: @${session.twitter.twitterHandle}`,
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                            <html lang="en">
                            <head>
                                <meta charset="utf-8">
                                <title>Nomination Received Notification</title>
                                <meta name="description" content="Nomination Received Notification">
                                <meta name="author" content="Lacuna Strategies">
                                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                            </head>
                            
                            <body>
                                <div class="container" style="margin-left: 20px;margin-right: 20px;">
                                <h3>You've received a new Nomination from @${session.twitter.twitterHandle}</h3>
                                <div style="font-size: 16px;">
                                    <p><strong>Nomination Type:</strong> ${type}</p>
                                    ${seniorScout1 !== '' ? `<p><strong>Senior Scout Nominee:</strong> @${seniorScout1}</p>` : ''}
                                    ${seniorScout2 !== '' ? `<p><strong>Senior Scout Nominee:</strong> @${seniorScout2}</p>` : ''}
                                    ${member !== '' ? `<p><strong>Member Nominee:</strong> @${member}</p><br />` : ''}
                                    <p>Log in to the Admin section of your website and approve or deny the nomination!</p>
                                </div>
                                </div>
                            </body>
                            </html>`,
                })
            } catch (err) {
                console.log(err)
                errors.push(err)
            }

            res.status(errors.length > 0 ? 207 : 200).json({ success: true, insertData, errorCount: errors.length, errors })

            break

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}