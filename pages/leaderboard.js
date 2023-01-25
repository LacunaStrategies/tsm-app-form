// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

const Leaderboard = () => {

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

    return (
        <div className="bg-sportsBlue min-h-screen flex flex-col items-center justify-center">
            <header className="text-center">
                <div className="container mx-auto px-4 mb-8">
                    <h1 className="text-3xl text-white uppercase mb-4">Leaderboard</h1>
                    <input className="w-full py-3 px-2 border border-sportsGray" type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
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
    );
}

export default Leaderboard;


