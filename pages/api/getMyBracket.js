import clientPromise from '/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function getApplications(req, res) {
    const { method } = req

    const token = await getToken({ req })
    if (!token)
        return res.status(401).json({ message: 'Invalid User Request!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            const user = await db.collection('members').findOne({ twitterHandle: token.userProfile.twitterHandle })
            if (!user || user.status !== "accepted")
                return res.status(401).json({ message: 'Invalid Request!' })

            const team = await db.collection('teams').findOne({ _id: user.teamId })
            const teamMembers = await db.collection('members').find({ teamId: team._id }).toArray()

            res.status(200).json({ user, team, teamMembers })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}