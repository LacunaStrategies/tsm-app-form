// ** React Imports
import { useEffect, useState } from 'react'

// ** NextAuth Imports
import { useSession, getSession } from "next-auth/react"

// ** WAGMI Imports
import { useAccount } from 'wagmi'

// ** NextJS Imports
import Link from 'next/link'

// ** Axios Import
import axios from 'axios'

// ** Framer Motion Imports
import { AnimatePresence } from 'framer-motion'



// ** Component Imports
import ApplicationAccepted from "../components/ApplicationAccepted"
import Brackets from "../components/Brackets"
import Modal from '../components/Modal'
import Connections from '../components/Connections'
import AuthConnect from '../components/AuthConnect'

export default function MyTeam() {

    // State Variables
    const [pageLoading, setPageLoading] = useState(true)
    const [bracketData, setBracketData] = useState([])
    const [teamMembers, setTeamMembers] = useState([])
    const [walkthrough, setWalkthrough] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [formType, setFormType] = useState('')
    const [validUser, setValidUser] = useState(false)

    // Hooks
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const open = (type) => {
        setFormType(type)
        setModalOpen(true)
    }

    const close = () => {
        
        if (typeof window !== 'undefined') {
            console.log('Set LS Variable')
            localStorage.setItem('tsm-wt', 'true')
        }

        setWalkthrough(0)        
        setModalOpen(false)
        setFormType('')
    }

    const skipWalkthrough = () => {
        setWalkthrough(0)
        if (typeof window !== 'undefined') {
            console.log('Set LS Variable')
            localStorage.setItem('tsm-wt', 'true')
        }
    }

    useEffect(() => {
        const getBracketData = async () => {
            try {
                const resp = await axios.get('/api/getMyBracket')

                setBracketData(resp.data)
                setTeamMembers(resp.data.teamMembers)
                setValidUser(true)
                setPageLoading(false)

            } catch (err) {
                console.error(err)
                setPageLoading(false)
            }
        }
        getBracketData()
    }, [])

    if (pageLoading)
        return 'Loading...'

    if (status === 'loading')
        return 'Loading...'

    if (status === 'unauthenticated')
        return <AuthConnect />

    if (!validUser)
        return (
            <div className="bg-sportsBlue min-h-screen flex flex-col items-center justify-center text-white">
                <div>
                    <p>No approved application or nomination acceptance found!</p>
                    <div className="mt-8 flex flex-wrap justify-center items-center">
                        <Link href="/">
                            <a className="border border-sportsGray py-3 px-4 md:mr-8">Apply Now!</a>
                        </Link>
                        <Link href="/nominations">
                            <a className="border border-sportsGray py-3 px-4 md:mr-8">Check Nomination</a>
                        </Link>
                    </div>
                </div>
            </div>
        )

    return (
        <div className="bg-sportsBlue min-h-screen flex flex-col items-center justify-center">
            <header className="absolute top-0 right-0">
                <Connections address={address} session={session} />
            </header>
            <div className="container mx-auto px-4 py-8">
                <ApplicationAccepted
                    heading='Congratulations'
                    subHeading='You Made The Cut 🎉'
                    content={`Welcome, ${bracketData.user.role}! ${bracketData.user.role === "Elite Scout" ? 'Your application has been selected.' : ' '} Now, the real fun starts!  ${(bracketData.user.role === "Elite Scout" || bracketData.user.role === "Senior Scout") ? 'Use chart below to BUILD YOUR TEAM.' : 'Start connecting with your team !'}`}
                />
                <Brackets
                    bracketData={bracketData}
                    teamMembers={teamMembers}
                    walkthrough={walkthrough}
                    setWalkthrough={setWalkthrough}
                    skipWalkthrough={skipWalkthrough}
                    open={open}
                />
            </div>
            <AnimatePresence
                // Disable any initial animations on children that
                // are present when the component is first rendered
                initial={false}
                // Only render one component at a time.
                // The exiting component will finish its exit
                // animation before entering component is rendered
                wait={true}
                // Fires when all exiting nodes have completed animating out
                onExitComplete={() => null}
            >
                {
                    modalOpen &&
                    <Modal
                        type={formType}
                        modalOpen={modalOpen}
                        handleClose={close}
                        bracketData={bracketData}
                        setBracketData={setBracketData}
                        teamMembers={teamMembers}
                        setTeamMembers={setTeamMembers}
                    />
                }
            </AnimatePresence>
        </div>
    )
}