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

            const user = await db.collection('scoutlist').findOne({ twitterId: session.twitter.twitterId })
            if (!user || user.status !== "accepted")
                return res.status(401).json({ message: 'Invalid Request!' })

            const team = await db.collection('teams').findOne({ _id: user.teamId })
            const teamMembers = await db.collection('scoutlist').find({ teamId: team._id }).toArray()

            res.status(200).json({ user, team, teamMembers })

            break

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}