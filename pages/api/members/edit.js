import clientPromise from '/lib/mongodb'

export default async function getApplications(req, res) {
    const { method, body } = req

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'POST':

            const twitterHandle = body.twitterHandle.replace('@','')

            try {
                const exists = await db.collection('members').findOne({ twitterHandle })
                if (!exists)
                    return res.status(400).json({ message: 'User Not Found!' })

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
                        if (v.twitterHandle === twitterHandle)
                            return

                        if (v.role === 'Elite Scout')
                            elites++

                        if (v.role === 'Senior Scout')
                            seniors++

                        if (v.role === 'Member')
                            members++
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

                const updatedUser = await db.collection('members').updateOne(
                    { twitterHandle },
                    {
                        $set:
                            {
                                role: body.role,
                                twitterHandle,
                                nominatedBy: body.nominatedBy.replace('@',''),
                                status: body.status,
                                teamId: team._id
                            }
                    }
                )

                console.log(updatedUser)

                res.status(200).json({ message: 'User Successfully Updated!' })
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