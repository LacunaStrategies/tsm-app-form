import axios from "axios"
import { useEffect, useState } from "react"

function Page() {

    const [loading, setLoading] = useState(true)
    const [nominations, setNominations] = useState([])
    const [viewApplication, setViewApplication] = useState()
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getNominations = async () => {
            const resp = await axios.get('/api/getNominations')
            const { nominations } = resp.data

            setNominations(nominations)
            setLoading(false)
        }
        getNominations()
    }, [])

    const approve = async (nominationId) => {
        try {
            const resp = await axios.put(`/api/approveNomination?nominationId=${nominationId}`)
            alert('Success! Page will need refresh to see changes.')
        } catch (err) {
            alert(err.response?.data.message || err.message)
            console.error(err)
        }
    }

    const reject = async (nominationId) => {
        try {
            const resp = await axios.put(`/api/rejectApplication?nominationId=${nominationId}`)
            alert('Success! Page will need refresh to see changes.')
        } catch (err) {
            alert(err.response?.data.message || err.message)
            console.error(err)
        }
    }

    const toggleView = (nominationId) => {
        if (viewApplication === nominationId) {
            setViewApplication('')
        } else {
            setViewApplication(nominationId)
        }
    }

    if (loading)
        return 'Loading nominations...'

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="mb-8">
                <input className="w-full py-3 px-2 border border-sportsGray" type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
            </div>
            {
                nominations.map((nomination) => {
                    if (search !== '') {
                        if (nomination.twitterHandle.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                            return (
                                <div
                                    key={nomination._id}
                                    className="border border-sportsBlue p-5 mb-4 flex items-center"
                                >
                                    <div className="">
                                    <div>
                                        <strong>Twitter Handle: </strong>
                                        <a href={`https://www.twitter.com/${nomination.twitterHandle}`} title={`Follow ${nomination.twitterHandle} on Twitter!`}>@{nomination.twitterHandle}</a>
                                    </div>
                                    <div>
                                        <strong>Nominated By: </strong>
                                        <a href={`https://www.twitter.com/${nomination.nominatedBy}`} title={`Follow ${nomination.nominatedBy} on Twitter!`}>@{nomination.nominatedBy}</a>
                                    </div>
                                    <div>
                                        <strong>Role: </strong>
                                        {nomination.role}
                                    </div>
                                </div>

                                    <div className="flex">
                                        <button onClick={() => approve(nomination._id)} className="ml-auto bg-green-700 py-2 px-3 text-white">Approve</button>
                                        <button onClick={() => reject(nomination._id)} className="ml-4 bg-red-500 py-2 px-3 text-white">Reject</button>
                                    </div>
                                </div>
                            )
                        }
                    } else {
                        return (
                            <div
                                key={nomination._id}
                                className="border border-sportsBlue p-5 mb-4 flex items-center justify-between"
                                >
                                <div className="">
                                    <div>
                                        <strong>Twitter Handle: </strong>
                                        <a href={`https://www.twitter.com/${nomination.twitterHandle}`} title={`Follow ${nomination.twitterHandle} on Twitter!`}>@{nomination.twitterHandle}</a>
                                    </div>
                                    <div>
                                        <strong>Nominated By: </strong>
                                        <a href={`https://www.twitter.com/${nomination.nominatedBy}`} title={`Follow ${nomination.nominatedBy} on Twitter!`}>@{nomination.nominatedBy}</a>
                                    </div>
                                    <div>
                                        <strong>Role: </strong>
                                        {nomination.role}
                                    </div>
                                </div>

                                <div className="flex">
                                    <button onClick={() => approve(nomination._id)} className="ml-auto bg-green-700 py-2 px-3 text-white">Approve</button>
                                    <button onClick={() => reject(nomination._id)} className="ml-4 bg-red-500 py-2 px-3 text-white">Reject</button>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}
export default Page
