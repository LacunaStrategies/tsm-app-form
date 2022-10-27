import axios from "axios"
import { useEffect, useState } from "react"
import trimString from "../../../utils/trimString"

function Page() {

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewApplication, setViewApplication] = useState()
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getApplications = async () => {
            const resp = await axios.get('/api/getApplications')
            const { applications } = resp.data

            setApplications(applications)
            setLoading(false)
        }
        getApplications()
    }, [])

    const approve = async (applicationId) => {
        try {
            const resp = await axios.put(`/api/approveApplication?applicationId=${applicationId}`)
            alert('Success! Page will need refresh to see changes.')
        } catch (err) {
            alert('An unexpected error occurred!')
            console.error(err)
        }
    }

    const reject = async (applicationId) => {
        try {
            const resp = await axios.put(`/api/rejectApplication?applicationId=${applicationId}`)
            alert('Success! Page will need refresh to see changes.')
        } catch (err) {
            alert('An unexpected error occurred!')
            console.error(err)
        }
    }

    const toggleView = (applicationId) => {
        if (viewApplication === applicationId) {
            setViewApplication('')
        } else {
            setViewApplication(applicationId)
        }
    }

    if (loading)
        return 'Loading applications...'

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="mb-8">
                <input className="w-full py-3 px-2 border border-sportsGray" type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
            </div>
            {
                applications.map((application) => {
                    if (search !== '') {
                        if ( application.wallet.toLowerCase().indexOf(search.toLowerCase()) > -1 || application.twitter.toLowerCase().indexOf(search.toLowerCase()) > -1 || application.q0.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                            return (
                                <div
                                    key={application._id}
                                    className="border border-sportsBlue p-5 mb-4"
                                >
                                    <div className="">
                                        <div>
                                            <strong>Twitter Handle: </strong>
                                            {application.twitter}
                                        </div>
                                        <div>
                                            <strong>Discord ID: </strong>
                                            {application.q0}
                                        </div>
                                        <div>
                                            <strong>Wallet Address: </strong>
                                            {application.wallet}
                                        </div>
                                        <div>
                                            <strong>Status: </strong>
                                            <span className={`${application.status === 'Pending' ? 'text-yellow-300' : application.status === 'Approved' ? 'text-green-700' : 'text-red-500' }`}>{application.status}</span>
                                        </div>
                                    </div>
                                    {
                                        viewApplication === application._id && (
                                            <div className="mt-2">
                                                <ul>
                                                    <li><strong>Category:</strong> {application.q1}</li>
                                                    <li><strong>Web3:</strong> {application.q2}</li>
                                                    <li><strong>Projects:</strong> {application.q3}</li>
                                                    <li><strong>Why The Sports Metaverse:</strong> {application.q4}</li>
                                                    <li><strong>Favorite Sports Team:</strong> {application.q5}</li>
                                                    <li><strong>Scout Team:</strong> {application.q6}</li>
                                                    <li><strong>Links:</strong> {application.q7}</li>
                                                </ul>
                                            </div>
                                        )
                                    }
                                    <div className="flex">
                                        <button onClick={() => toggleView(application._id)}>{viewApplication === application._id ? 'Hide Answers' : 'Show Answers'}</button>
                                        <button onClick={() => approve(application._id)} className="ml-auto bg-green-700 py-2 px-3 text-white">Approve</button>
                                        <button onClick={() => reject(application._id)} className="ml-4 bg-red-500 py-2 px-3 text-white">Reject</button>
                                    </div>
                                </div>
                            )
                        }
                    } else {
                        return (
                            <div
                                key={application._id}
                                className="border border-sportsBlue p-5 mb-4"
                            >
                                <div className="">
                                    <div>
                                        <strong>Twitter Handle: </strong>
                                        {application.twitter}
                                    </div>
                                    <div>
                                        <strong>Wallet Address: </strong>
                                        {application.wallet}
                                    </div>
                                    <div>
                                        <strong>Status: </strong>
                                        <span className={`${application.status === 'Pending' ? 'text-yellow-300' : application.status === 'Approved' ? 'text-green-700' : 'text-red-500' }`}>{application.status}</span>
                                    </div>
                                </div>
                                {
                                    viewApplication === application._id && (
                                        <div className="mt-2">
                                            <ul>
                                                <li><strong>Category:</strong> {application.q1}</li>
                                                <li><strong>Web3:</strong> {application.q2}</li>
                                                <li><strong>Projects:</strong> {application.q3}</li>
                                                <li><strong>Why The Sports Metaverse:</strong> {application.q4}</li>
                                                <li><strong>Favorite Sports Team:</strong> {application.q5}</li>
                                                <li><strong>Scout Team:</strong> {application.q6}</li>
                                                <li><strong>Links:</strong> {application.q7}</li>
                                            </ul>
                                        </div>
                                    )
                                }
                                <div className="flex">
                                    <button onClick={() => toggleView(application._id)}>{viewApplication === application._id ? 'Hide Answers' : 'Show Answers'}</button>
                                    <button onClick={() => approve(application._id)} className="ml-auto bg-green-700 py-2 px-3 text-white">Approve</button>
                                    <button onClick={() => reject(application._id)} className="ml-4 bg-red-500 py-2 px-3 text-white">Reject</button>
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
