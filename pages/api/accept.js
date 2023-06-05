// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    const { method } = req

    // Verify active sesion before proceeding
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ message: 'Twitter connection is required to accept your nomination!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            const updatedUser = await db.collection('scoutlist').updateOne(
                { twitterId: session.twitter.twitterId },
                {
                    $set: {
                        status: 'accepted'
                    }
                }
            )

            if (!updatedUser.matchedCount)
                return res.status(401).json({ success: false, message: 'User Not Found!' })

            res.status(200).json({ success: true })

            break

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}