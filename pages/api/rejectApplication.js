// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** NextAuth Imports
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function submit(req, res) {
    const { method } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Verify active sesion before proceeding
            const session = await unstable_getServerSession(req, res, authOptions)
            const { applicationId } = req.query

            const rejectedApplication = await db.collection('applications').updateOne(
                { _id: ObjectId(applicationId) },
                { $set: { status: "Rejected" } }
            )

            if (!rejectedApplication.modifiedCount)
                return res.status(400).json({ ok: false })
                
            res.status(200).json({ ok: true })
            break;

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}