// ** MongoDB Imports
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function getApplications(req, res) {
    const { method } = req

    // Verify active sesion before proceeding
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ message: 'Twitter connection is required to access this data!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            const application = await db.collection('applications').findOne({ twitterId: session.twitter.twitterId })

            let phase = application ? 3 : 2
            let status = application?.status || null

            res.status(200).json({ phase, status })

            break

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}