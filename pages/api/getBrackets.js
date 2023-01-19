import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'GET':
            const brackets = await db.collection('teams').aggregate([
                {
                    $lookup:
                        {
                            from: 'members',
                            localField: "_id",
                            foreignField: "teamId",
                            as: "team_members"
                        }
                }
            ]).toArray()
            console.log(brackets)

            res.status(200).json({ brackets })

            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}