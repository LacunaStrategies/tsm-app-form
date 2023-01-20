import clientPromise from '/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function getApplications(req, res) {
    const { method } = req
    const { twitterHandle } = req.query
    const token = await getToken({ req })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            let phase = 2
            const application = await db.collection('applications').findOne({ twitter: twitterHandle })

            if (application)
                phase = 3

            res.status(200).json({ phase, status: application.status, token })
            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}