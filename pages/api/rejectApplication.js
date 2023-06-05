// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function submit(req, res) {
    const { method } = req
    const { applicationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Verify active sesion before proceeding
            const session = await getServerSession(req, res, authOptions)
            if (!session)
                return res.status(401).json({ message: 'Twitter connection is required for this application!' })

            const rejectedApplication = await db.collection('applications').updateOne(
                { _id: ObjectId(applicationId) },
                { $set: { status: "Rejected" } }
            )

            if (!rejectedApplication.modifiedCount)
                return res.status(400).json({ ok: false })

            res.status(200).json({ ok: true })
            break

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}