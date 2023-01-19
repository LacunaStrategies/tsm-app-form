import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method, body } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            try {
                const exists = await db.collection('members').findOne({ twitterHandle: body.twitterHandle })
                if (exists)
                    return res.status(400).json({ message: 'User Already Exists!' })

                const team = await db.collection('teams').findOne({ name: body.teamName })
                if (!team)
                    return res.status(400).json({ message: 'Invalid Team: Does Not Exist!' })

                const teamMembers = await db.collection('members').find({ teamId: team._id }).toArray()

                if (teamMembers.length > 0) {
                    const maxElites = 1
                    const maxSeniors = 2
                    const maxMembers = 2

                    let elites = 0
                    let seniors = 0
                    let members = 0

                    teamMembers.forEach(function (v, i) {
                        switch (v.role) {
                            case 'Elite Scout':
                                elites++
                                break;
                            case 'Senior Scout':
                                seniors++
                                break;
                            case 'Member':
                                members++
                                break;
                            default:
                                return
                        }
                    })

                    switch (body.role) {
                        case 'Elite Scout':
                            elites++
                            break;
                        case 'Senior Scout':
                            seniors++
                            break;
                        case 'Member':
                            members++
                            break;
                        default:
                            return
                    }

                    if (elites > maxElites || seniors > maxSeniors || members > maxMembers)
                        return res.status(400).json({ message: `Exceeds maximum ${body.role}s on the team!` })
                }


                const insert = await db.collection('members').insertOne({
                    role: body.role,
                    twitterHandle: body.twitterHandle.toLowerCase(),
                    nominatedBy: body.nominatedBy,
                    status: 'pending',
                    teamId: team._id
                })

                console.log(insert)

                res.status(200).json({ message: 'User Successfully Added!' })
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