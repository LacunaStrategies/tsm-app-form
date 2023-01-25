import clientPromise from '/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function getApplications(req, res) {
    const { method } = req
    const token = await getToken({ req })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            const application = await db.collection('applications').findOne({ twitter: token.userProfile.twitterHandle })

            let phase = application ? 3 : 2
            let status = application?.status || null

            res.status(200).json({ phase, status })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}