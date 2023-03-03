// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** Next Auth Import
import { getToken } from 'next-auth/jwt'

// ** Twitter Import
import Twitter from 'twitter-lite'

export default async function handler(req, res) {
    const { method } = req
    const { nominationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Get nomination data
            const nomination = await db.collection('members').findOne({ _id: ObjectId(nominationId) })
            if (!nomination || nomination?.status === 'approved' || nomination?.status === 'accepted')
                return res.status(400).json({ message: 'Nomination not found or has already been approved/accepted!' })

            // Approve nomination
            const approvednomination = await db.collection('members').updateOne(
                { _id: ObjectId(nominationId) },
                { $set: { status: "approved" } }
            )

            // Verify update completed succesfully
            if (!approvednomination.modifiedCount)
                return res.status(400).json({ message: 'There was an issue updating the record!' })

            const t = new Twitter({
                consumer_key: process.env.LSDEVLABSAPP_TWITTER_API_KEY,
                consumer_secret: process.env.LSDEVLABSAPP_TWITTER_API_SECRET,
                access_token_key: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN_SECRET
            })

            // Connect to Twiiter and retrieve Nominee Profile Pic
            
            const parameters = { 
                status: `Congratulations, @${nomination.twitterHandle}! You have been nominated by ${nomination.role === 'Member' ? 'Senior Scout' : 'Elite Scout'} @${nomination.nominatedBy} to be a ${nomination.role} on their team! Head on over to our website to accept your nomination${nomination.role === "Senior Scout" ? ' and start building your team' : ''}!` 
            }
            
            try {
                const resp = await t.post('statuses/update', parameters)
                console.log(resp)
            } catch (err) {
                console.log(err)
                return res.status(500).json({ message: 'An unexpected error occurred while posting Twitter status update!' })
            }

            res.status(200).json({ ok: true })
            break;

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}