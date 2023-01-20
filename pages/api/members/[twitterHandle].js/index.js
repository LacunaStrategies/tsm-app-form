import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req
    const { twitterHandle } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':

            try {

                const member = await db.collection('members').findOne({ twitterHandle: twitterHandle.toLowerCase() })

                if (!member)
                    return res.status(400).json({ message: 'User not found!' })

                res.status(200).json({ member })

            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}