import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req
    const { teamName } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':
            const exists = await db.collection('teams').findOne({ name: teamName })

            if (exists)
                return res.status(400).json({ message: 'Team Already Exists!' })

            const insert = await db.collection('teams').insertOne({
                name: teamName,
            })

            res.status(200).json({ message: 'Team Successfully Added!' })

            break;

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}