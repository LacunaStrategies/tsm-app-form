// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    console.log('Received request')
    const { method } = req
    const { nominationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Verify active sesion before proceeding
            const session = await getServerSession(req, res, authOptions)
            if (!session)
                return res.status(401).json({ message: 'Twitter connection is required for this application!' })

            const rejectedNomination = await db.collection('scoutlist').deleteOne({ _id: ObjectId(nominationId) })
            if (!rejectedNomination.deletedCount)
                return res.status(401).json({ message: 'User Not Found!' })

            res.status(200).json({ ok: true })
            break

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}