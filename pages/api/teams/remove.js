import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method } = req
    const { teamName } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            try {
                const team = await db.collection('teams').findOne({ name: teamName })

                if (!team)
                    return res.status(400).json({ message: 'Team Not Found!' })

                const deletedMembers = await db.collection('members').deleteMany({ teamId: team._id })
                const deletedTeam = await db.collection('teams').deleteOne({ name: teamName })

                console.log(deletedMembers, deletedTeam)
                res.status(200).json({ message: 'Team and All Members Removed!' })
            
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