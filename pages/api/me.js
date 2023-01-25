import clientPromise from '/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function me(req, res) {
    const { method } = req

    const token = await getToken({ req })
    if (!token)
        return res.status(401).json({ message: 'Please Connect Your Twitter!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            const user = await db.collection('members').findOne({ twitterHandle: token.userProfile.twitterHandle })
            res.status(200).json({ user })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}