import clientPromise from '/lib/mongodb'

export default async function handler(req, res) {
    const { method } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':
            const nominations = await db.collection('members').find({ status: 'nominated' }).toArray()
            res.status(200).json({ nominations })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}