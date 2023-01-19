import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req
    const { oldTeamName, newTeamName } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':
            
            try {
                const currentTeam = await db.collection('teams').findOne({ name: oldTeamName })

                if (!currentTeam)
                    return res.status(400).json({ message: 'Team Not Found!' })
    
                const exists = await db.collection('teams').findOne({ name: newTeamName })
                
                if (exists)
                    return res.status(400).json({ message: 'Team Name Already Taken!' })
    
                const update = await db.collection('teams').updateOne(
                    { name: oldTeamName },
                    { $set: { name: newTeamName} }
                )
                    
                if (!update.modifiedCount)
                    return res.status(500).json({ message: 'An Unexpected Error Occurred!' })

                res.status(200).json({ message: 'Team Successfully Added!' })
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }

            break;

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}