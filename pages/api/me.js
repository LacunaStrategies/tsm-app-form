// ** MongoDB Imports
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function me(req, res) {
    const { method } = req

    // Verify active sesion before proceeding
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ message: 'Twitter connection is required for this application!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            const user = await db.collection('scoutlist').findOne({ twitterId: session.twitter.twitterId })
            res.status(200).json({ user })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}