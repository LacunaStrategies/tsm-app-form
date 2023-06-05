// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

const Leaderboard = () => {

    const [sortAsc, setSortAsc] = useState(false)
    const [sortBy, setSortBy] = useState("teamFollowers")
    const [pageLoading, setPageLoading] = useState(true)
    const [bracketData, setBracketData] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getBracketData = async () => {
            try {
                const resp = await axios.get('/api/getBrackets')
                const { brackets } = resp.data

                setBracketData(brackets)

                setPageLoading(false)
            } catch (err) {
                console.error(err)
                alert('An unexpected error occurred!')
                setPageLoading(false)
            }
        }
        getBracketData()
    }, [])

    /**
     * * Sort Bracket Data Ascending
     * @dev Sorts bracket data in ascending order based on supplied argument
     * @param {string} sortBy 
     * @param {boolean} ascending
     */
    const sortBracketData = (sortBy = "teamFollowers", ascending = true) => {
        const bracketDataCopy = bracketData.map((bracket, i) => {
            let teamFollowers = 0

            bracket.team_members.forEach(function (v, i) {
                teamFollowers += v.followers || 0
            })

            return { ...bracket, teamFollowers }
        })

        if (ascending) {
            bracketDataCopy.sort((a,b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0))
        } else {
            bracketDataCopy.sort((a,b) => (a[sortBy] < b[sortBy]) ? 1 : ((b[sortBy] < a[sortBy]) ? -1 : 0))
        }

        setBracketData(bracketDataCopy)
        setSortAsc(ascending)
    }

    return (
        <div className="bg-sportsBlue min-h-screen flex flex-col items-center justify-center">
            <header className="text-center">
                <div className="container mx-auto px-4 mb-8">
                    <h1 className="text-3xl text-white uppercase mb-4">Leaderboard</h1>
                    <div className="mb-8">
                        <input className="py-3 px-2 w-full rounded-md border border-sportsGray" type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
                    </div>
                    <div className="flex items-center justify-center">
                        <label
                            htmlFor="sortBy"
                            className="text-white mr-4"
                        >
                            Sort By:
                        </label>
                        <select
                            name="sortBy"
                            id="sortBy"
                            className="relative h-12 pl-4 pr-8 text-neutral-800 rounded-l-md appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Team Name</option>
                            <option value="createdOn">Team Creation Date</option>
                            <option value="teamFollowers">Total Followers</option>
                        </select>
                        <button
                            onClick={() => sortBracketData(sortBy, !sortAsc)}
                            className="p-3 rounded-r-md bg-neutral-400 text-white inline-block w-auto"
                        >
                            {
                                sortAsc ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-sort-down-alt" viewBox="0 0 16 16">
                                        <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
            </header>
            {
                pageLoading ? (
                    'Loading...'
                ) : (
                    <main>
                        {
                            bracketData.map((bracket) => {

                                const eliteScout = bracket.team_members.filter((member) => member.role === "Elite Scout")[0]
                                const seniorScout1 = bracket.team_members.filter((member) => member.role === "Senior Scout")[0]
                                const seniorScout2 = bracket.team_members.filter((member) => member.role === "Senior Scout")[1]
                                const member1 = bracket.team_members.filter((member) => member.role === "Member")[0]
                                const member2 = bracket.team_members.filter((member) => member.role === "Member")[1]

                                if (search !== '') {
                                    if (bracket.team_members.filter((member) => member.twitterHandle.toLowerCase().indexOf(search.toLowerCase()) > -1).length > 0) {
                                        return (
                                            <section key={bracket._id} className="text-white mt-12 border border-white">
                                                <div className="flex items-center">
                                                    <div className="relative mr-8 before:absolute before:top-1/2 before:-right-8 before:w-8 before:border before: border-white">
                                                        <div className="flex justify-center items-center min-h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                            {eliteScout && <img src={eliteScout.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                            {eliteScout && eliteScout.twitterHandle}
                                                        </div>
                                                    </div>
                                                    <div className="relative before:absolute before:left-0 before:top-[38px] before:border-l-2 before:border-l-white before:h-[106px]">
                                                        <div className="flex items-center mb-8">
                                                            <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                                <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                    {seniorScout1?.status === "accepted" && <img src={seniorScout1?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                    {
                                                                        seniorScout1?.status === "nominated" ? 'Pending Review...' :
                                                                            seniorScout1?.status === "approved" ? 'Pending Acceptance...' :
                                                                                seniorScout1?.status === "accepted" ? seniorScout1?.twitterHandle : 'Pending Nomination...'

                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                                <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                    {member1?.status === "accepted" && <img src={member1?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                    {
                                                                        member1?.status === "nominated" ? 'Pending Review...' :
                                                                            member1?.status === "approved" ? 'Pending Acceptance' :
                                                                                member1?.status === "accepted" ? member1?.twitterHandle : 'Pending Nomination...'

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center mt-8">
                                                            <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                                <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                    {seniorScout2?.status === "accepted" && <img src={seniorScout2?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                    {
                                                                        seniorScout2?.status === "nominated" ? 'Pending Review...' :
                                                                            seniorScout2?.status === "approved" ? 'Pending Acceptance' :
                                                                                seniorScout2?.status === "accepted" ? seniorScout2?.twitterHandle : 'Pending Nomination...'

                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                                <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                    {member2?.status === "accepted" && <img src={member2?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                    {
                                                                        member2?.status === "nominated" ? 'Pending Review...' :
                                                                            member2?.status === "approved" ? 'Pending Acceptance' :
                                                                                member2?.status === "accepted" ? member2?.twitterHandle : 'Pending Nomination...'

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )
                                    }
                                } else {
                                    return (
                                        <section key={bracket._id} className="text-white mt-12 border border-white p-4 bg-sportsBlue shadow-lg shadow-black">
                                            <div className="flex items-center">
                                                <div className="relative mr-8 before:absolute before:top-1/2 before:-right-8 before:w-8 before:border before: border-white">
                                                    <div className="flex justify-center items-center min-h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                        {eliteScout && <img src={eliteScout.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                        {eliteScout && eliteScout.twitterHandle}
                                                    </div>
                                                </div>
                                                <div className="relative before:absolute before:left-0 before:top-[38px] before:border-l-2 before:border-l-white before:h-[106px]">
                                                    <div className="flex items-center mb-8">
                                                        <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                            <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                {seniorScout1?.status === "accepted" && <img src={seniorScout1?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                {
                                                                    seniorScout1?.status === "nominated" ? 'Pending Review...' :
                                                                        seniorScout1?.status === "approved" ? 'Pending Acceptance...' :
                                                                            seniorScout1?.status === "accepted" ? seniorScout1?.twitterHandle : 'Pending Nomination...'

                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                            <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                {member1?.status === "accepted" && <img src={member1?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                {
                                                                    member1?.status === "nominated" ? 'Pending Review...' :
                                                                        member1?.status === "approved" ? 'Pending Acceptance' :
                                                                            member1?.status === "accepted" ? member1?.twitterHandle : 'Pending Nomination...'

                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mt-8">
                                                        <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                            <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                {seniorScout2?.status === "accepted" && <img src={seniorScout2?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                {
                                                                    seniorScout2?.status === "nominated" ? 'Pending Review...' :
                                                                        seniorScout2?.status === "approved" ? 'Pending Acceptance' :
                                                                            seniorScout2?.status === "accepted" ? seniorScout2?.twitterHandle : 'Pending Nomination...'

                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="relative ml-8 before:absolute before:top-1/2 before:-left-8 before:w-8 before:border before: border-white">
                                                            <div className="flex justify-center items-center h-[74px] w-[240px] px-4 py-2 bg-gray-600 rounded-xl">
                                                                {member2?.status === "accepted" && <img src={member2?.profilePic} width={70} height={70} alt="Profile Pic" className="rounded-full mr-4" />}
                                                                {
                                                                    member2?.status === "nominated" ? 'Pending Review...' :
                                                                        member2?.status === "approved" ? 'Pending Acceptance' :
                                                                            member2?.status === "accepted" ? member2?.twitterHandle : 'Pending Nomination...'

                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )
                                }
                            })
                        }
                    </main>
                )
            }
        </div>
    )
}

export default Leaderboard;


