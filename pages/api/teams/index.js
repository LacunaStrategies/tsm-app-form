import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':
            const teams = await db.collection('teams').find({}).toArray()
            res.status(200).json({ teams })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}