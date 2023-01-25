// ** NextAuth Imports
import { useSession, getSession } from "next-auth/react"

// ** WAGMI Imports
import { useAccount } from 'wagmi'

// ** Axios Import
import axios from 'axios'

// ** NextJS Imports
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

// ** Framer Motion Imports
import { AnimatePresence, motion } from "framer-motion"

// ** React imports
import { useEffect, useState } from "react"

// ** Component Imports
import AuthConnect from "../components/AuthConnect"
import Connections from "../components/Connections"
import WagmiConnect from "../components/WagmiConnect"

const Nominations = () => {

    // State Variables
    const [pageLoading, setPageLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null)

    // Hooks
    const { data: session, status } = useSession()
    const { address } = useAccount()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            setPageLoading(true)

            const getUser = async () => {
                try {
                    const resp = await axios.get('/api/me')
                    const { user } = resp.data

                    if (!user) {
                        setUser(null)
                    } else {
                        setUser(user)
                    }

                    setPageLoading(false)
                } catch (err) {
                    console.error(err)
                    setPageLoading(false)
                }
            }
            getUser()
        }
    }, [status])

    const handleAccept = async () => {
        setIsLoading(true)
        try {
            const resp = await axios.post('/api/accept')
            router.push('/my-team')
        } catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }
    const handleReject = async () => {
        try {
            const resp = await axios.post('/api/reject')
            router.push('/')
        } catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }

    if (pageLoading || status === 'loading')
        return (
            <div className="bg-sportsBlue min-h-screen flex flex-col justify-center items-center pt-[200px] pb-[50px] md:pt-[125px] md:pb-125px]">
                <div className="container mx-auto px-4 text-center text-white text-3xl">
                    Loading...
                </div>
            </div>
        )

    if (user?.status === "accepted") {
        router.push('/my-team')
    }

    return (
        <div className="bg-sportsBlue min-h-screen flex flex-col justify-center items-center pt-[200px] pb-[50px] md:pt-[125px] md:pb-125px]">
            <header className="absolute w-full top-0 flex flex-wrap md:flex-nowrap items-center">
                <div className="hidden md:block md:w-1/3 text-center">
                    <Image src="/assets/images/SMLogo_Transparent.webp" alt="The Sports Meta Logo" height={55} width={62} />
                </div>

                <div className="ml-auto">
                    <Connections address={address} session={session} />
                </div>
            </header>


            <AnimatePresence
                initial={false}
                mode='wait'
            >

                {/* Connect Twitter */}
                {
                    status === "unauthenticated" &&
                    <motion.div
                        className="border-2 border-gray-300 rounded-3xl text-center py-5 px-10 max-w-xl text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="connectTwitter"
                    >
                        <AuthConnect session={session} />
                    </motion.div>
                }

                {/* Application Not Found */}
                {
                    (status === "authenticated" && !user) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="applicationNotFound"
                            className="container mx-auto px-4 text-center text-white text-3xl"
                        >
                            <p className="mb-8">No nominations found! Apply and start your own team!</p>
                            <Link href="/">
                                <a className="border border-sportsGray inline-block py-3 px-4 md:mr-8">Apply Now!</a>
                            </Link>
                        </motion.div>
                    )
                }

                {/* Application Pending Review */}
                {
                    (status === "authenticated" && user?.status === 'nominated') && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="applicationNominated"
                            className="container mx-auto px-4 text-center text-white text-3xl"
                        >
                            <h2 className="text-xl mb-8">Your nomination is still being reviewed by the team!</h2>
                            <h3 className="text-2xl">Check Back Soon!</h3>
                        </motion.div>
                    )
                }

                {/* Application Pending Acceptance */}
                {
                    (status === "authenticated" && user?.status === "approved") && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="applicationApproved"
                            className="container mx-auto px-4"
                        >
                            <div className="bg-sportsBlue shadow-[0_0_10px_0_rgba(0,0,0,0.8)] w-full max-w-5xl mx-auto rounded-[4rem] text-center text-white px-4 py-8">
                                <h1 className="text-3xl mb-8">You&apos;ve Been Nominated 🎉</h1>
                                <p className="max-w-sm mx-auto font-light mb-14">@{user?.nominatedBy} thinks you&apos;re pretty awesome and wants you to join their team! Are you in?</p>

                                <div className="md:flex md:justify-center">
                                    <button
                                        onClick={handleAccept}
                                        disabled={isLoading}
                                        className="block mx-auto mb-4 md:mb-0 md:mx-0 md:mr-16 uppercase rounded-2xl py-4 px-5 bg-green-600 text-2xl font-semibold shadow-black shadow-md">Accept</button>
                                    <button
                                        onClick={handleReject}
                                        disabled={isLoading}
                                        className="block mx-auto md:mx-0 uppercase rounded-2xl py-4 px-5 bg-red-600 text-2xl font-semibold shadow-black shadow-md">Reject</button>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>


        </div>
    );
}

export default Nominations;