import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Bracket from "./Bracket"

const Brackets = ({ bracketData, walkthrough, setWalkthrough, skipWalkthrough, teamMembers, open }) => {

    const { team, user } = bracketData

    const eliteScout = teamMembers.filter((member) => member.role === "Elite Scout")[0]
    const seniorScout1 = teamMembers.filter((member) => member.role === "Senior Scout")[0]
    const seniorScout2 = teamMembers.filter((member) => member.role === "Senior Scout")[1]
    const member1 = teamMembers.filter((member) => member.role === "Member" && member.nominatedBy === seniorScout1?.twitterHandle)[0]
    const member2 = teamMembers.filter((member) => member.role === "Member" && member.nominatedBy === seniorScout2?.twitterHandle)[0]

    return (
        <>
            {
                walkthrough > 0 && (
                    <motion.div 
                        className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 z-10"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 0.75 }} 
                        transition={{ duration: 0.5, delay: 4.5 }}
                    >
                        <button
                            onClick={() => skipWalkthrough()}
                            className="transition-all duration-300 fixed bottom-10 right-10 text-gray-300 hover:text-white text-3xl">Skip Walkthrough</button>
                    </motion.div>
                )
            }
            <motion.main
                initial={{ opacity: 0, scale: 0.7, y: 120 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 4, duration: 1.5 }}
                className="text-white mt-12">
                <div className="max-w-7xl mx-auto border-2 border-white rounded-3xl px-8 pt-4 pb-8 lg:py-20 flex flex-col justify-center">

                    <div className="lg:flex lg:items-center lg:justify-center lg:mx-auto">
                        <div className={`relative mb-6 lg:mb-0 lg:mr-20 after:absolute after:w-[80px] after:border-t-4 after:border-white after:left-full after:top-1/2 ${walkthrough === 1 ? 'z-10' : ''}`}>
                            <Bracket
                                type="Elite Scout"
                                status={eliteScout?.status}
                                twitterHandle={eliteScout?.twitterHandle}
                                imgSrc={eliteScout?.profilePic}
                                isUser={eliteScout?.twitterHandle === user.twitterHandle}
                                walkthrough={walkthrough}
                                setWalkthrough={setWalkthrough}
                                open={open}
                            />
                        </div>
                        <div className="relative flex flex-col items-center justify-between lg:before:absolute lg:before:left-0 lg:before:top-11 lg:before:h-[calc(100%-86px)] lg:before:border-l-4 lg:before:border-white">
                            <div className="w-full mb-6 lg:flex lg:mb-40">
                                <div className="relative pl-4 sm:pl-8 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                    <Bracket
                                        type="Senior Scout"
                                        twitterHandle={seniorScout1?.twitterHandle}
                                        status={seniorScout1?.status}
                                        imgSrc={seniorScout1?.profilePic}
                                        isUser={seniorScout1?.twitterHandle === user.twitterHandle}
                                        canNominate={user.role === "Elite Scout"}
                                        walkthrough={walkthrough}
                                        setWalkthrough={setWalkthrough}
                                        open={open}
                                    />
                                </div>
                                <div className="relative pl-8 sm:pl-16 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                    <Bracket
                                        type="Member"
                                        twitterHandle={member1?.twitterHandle}
                                        status={member1?.status}
                                        imgSrc={member1?.profilePic}
                                        isUser={member1?.twitterHandle === user.twitterHandle}
                                        canNominate={user.role === "Senior Scout" && seniorScout1?.twitterHandle === user.twitterHandle}
                                        walkthrough={walkthrough}
                                        setWalkthrough={setWalkthrough}
                                        open={open}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:flex">
                                <div className="relative pl-4 sm:pl-8 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                    <Bracket
                                        type="Senior Scout"
                                        twitterHandle={seniorScout2?.twitterHandle}
                                        status={seniorScout2?.status}
                                        imgSrc={seniorScout2?.profilePic}
                                        isUser={seniorScout2?.twitterHandle === user.twitterHandle}
                                        canNominate={user.role === "Elite Scout"}
                                        walkthrough={walkthrough}
                                        setWalkthrough={setWalkthrough}
                                        open={open}
                                    />
                                </div>
                                <div className="relative pl-8 sm:pl-16 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                    <Bracket
                                        type="Member"
                                        twitterHandle={member2?.twitterHandle}
                                        status={member2?.status}
                                        imgSrc={member2?.profilePic}
                                        isUser={member2?.twitterHandle === user.twitterHandle}
                                        canNominate={user.role === "Senior Scout" && seniorScout2?.twitterHandle === user.twitterHandle}
                                        walkthrough={walkthrough}
                                        setWalkthrough={setWalkthrough}
                                        open={open}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.main>
        </>
    )
}

export default Brackets