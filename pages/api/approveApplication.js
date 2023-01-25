// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** NextAuth Imports
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

// ** Twitter Import
import Twitter from 'twitter-lite'

export default async function handler(req, res) {
    const { method } = req
    const { applicationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Verify active sesion before proceeding
            const session = await unstable_getServerSession(req, res, authOptions)

            // Get application data
            const application = await db.collection('applications').findOne({ _id: ObjectId(applicationId) })
            if (!application)
                return res.status(400).json({ message: 'Application not found!' })

            // Check for existing member
            const existingMember = await db.collection('members').findOne({ twitterHandle: application.twitter })
            if (existingMember)
                return res.status(400).json({ message: 'This individual is already part of another team!' })

            // Create New Team
            const newTeam = await db.collection('teams').insertOne({
                name: application.twitter,
                logo: '',
                homeColor: '',
                awayColor: '',
                trophies: [],
                points: 0,
                wins: 0,
                losses: 0,
            })

            // Add applicant to members collection as an Elite Scout
            const newMember = await db.collection('members').insertOne({
                role: 'Elite Scout',
                twitterHandle: application.twitter,
                profilePic: application.profilePic,
                nominatedBy: 'Application',
                status: 'accepted',
                teamId: newTeam.insertedId                
            })

            // Approve application
            const approvedApplication = await db.collection('applications').updateOne(
                { _id: ObjectId(applicationId) },
                { $set: { status: "Approved" } }
            )

            // Verify update completed succesfully
            if (!approvedApplication.modifiedCount)
                return res.status(400).json({ message: 'There was an issue updating the record!' })


            const t = new Twitter({
                consumer_key: process.env.LSDEVLABSAPP_TWITTER_API_KEY,
                consumer_secret: process.env.LSDEVLABSAPP_TWITTER_API_SECRET,
                access_token_key: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN_SECRET
            })

            const parameters = { 
                status: `Congratulations, @${application.twitter}! Your application has been accepted and your are now an Elite Scout! Head over to our website to start building your team!` 
            }
            
            try {
                const resp = await t.post('statuses/update', parameters)
                console.log(resp)
            } catch (err) {
                console.log(err)
                return res.status(500).json({ message: 'An error occurred while posting Twitter status update!' })
            }
            
                
            res.status(200).json({ ok: true })
            break;

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}