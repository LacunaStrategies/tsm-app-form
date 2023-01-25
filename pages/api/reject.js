import clientPromise from '/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
    const { method } = req

    const token = await getToken({ req })
    if (!token)
        return res.status(401).json({ message: 'Please Connect Your Twitter!' })

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            const updatedUser = await db.collection('members').deleteOne({ twitterHandle: token.userProfile.twitterHandle })

            if (!updatedUser.deletedCount)
                return res.status(401).json({ message: 'User Not Found!' })

            res.status(200).json({ ok: true })

            break;

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}