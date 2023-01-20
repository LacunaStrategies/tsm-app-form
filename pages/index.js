// ** React Imports
import { useEffect, useState } from 'react'

// ** NextAuth Imports
import { useSession } from 'next-auth/react'

// ** Wagmi Imports
import { useAccount } from 'wagmi'

// ** Framer Motion Imports
import { AnimatePresence, motion } from 'framer-motion'

// ** Axios Import
import axios from 'axios'

// ** Component Imports
import AuthConnect from '../components/AuthConnect'
import Connections from '../components/Connections'
import Form from '../components/Form'
import WagmiConnect from '../components/WagmiConnect'
import LightningBolt from '../components/LightningBolt'
import Spacer from '../components/Spacer'
import Confirmation from '../components/Confirmation'
import Image from 'next/image'

export default function Home() {

  // Hooks
  const { data: session } = useSession()
  const { address, isConnected } = useAccount()

  // States
  const [values, setValues] = useState({
    wallet: '',
    twitter: '',
    q0: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
  })
  const [isMounted, setIsMounted] = useState(false)
  const [phase, setPhase] = useState(0)
  const [status, setStatus] = useState('Pending')

  // Confirm component is mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Monitor initial phases by isConnected and session
  useEffect(() => {

    // If wallet and twitter are connected
    if (isConnected && session) {

      // Check for existing application and set phase to Form or Congratulations accordingly
      const checkApplication = async () => {
        const resp = await axios.get(`/api/getSessionApplication?twitterHandle=${session.twitter.twitterHandle}`)

        setStatus(resp.data.status)
        setPhase(resp.data.phase)
      }
      checkApplication()

    // If only wallet is connected, set phase to Twitter Connect
    } else if (isConnected) {
      setPhase(1)

    // Set phase to Wallet Connect 
    } else {
      setPhase(0)
    }

  }, [isConnected, session])

  if (!isMounted)
    return

  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-[200px] pb-[50px] md:pt-[125px] md:pb-[125px] px-4">

      {/* Top Section (Logo, Progress Bar, Connections) */}
      <header className="absolute w-full top-0 flex flex-wrap md:flex-nowrap items-center">
        <div className="hidden md:block md:w-1/3 text-center">
          <Image src="/assets/images/SMLogo_Transparent.webp" alt="The Sports Meta Logo" height={55} width={62} />
        </div>
        <ul id="lightningBolts" className="w-full py-5 px-5 flex items-center justify-center md:w-1/3">
          <LightningBolt active={phase === 0} filled={phase >= 0} />
          <Spacer />
          <LightningBolt active={phase === 1} filled={phase > 0} />
          <Spacer />
          <LightningBolt active={phase === 2} filled={phase > 1} />
          <Spacer />
          <LightningBolt active={phase === 3} filled={phase > 2} />
        </ul>
        <Connections address={address} session={session} />
      </header>

      {/* Connect Wallet */}
      <AnimatePresence
        initial={false}
        mode='wait'
      >
        {
          phase === 0 &&
          <motion.div
            className="border-2 border-gray-300 rounded-3xl text-center py-5 px-10 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="phase1"
          >
            <WagmiConnect />
          </motion.div>
        }

        {/* Connect Twitter */}
        {
          phase === 1 &&
          <motion.div
            className="border-2 border-gray-300 rounded-3xl text-center py-5 px-10 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="phase2"
          >
            <AuthConnect session={session} />
          </motion.div>
        }

        {/* Questions & Submit */}
        {
          phase === 2 &&
          <motion.div
            className="border-2 border-sportsGray rounded-3xl text-center py-5 px-3 w-full max-w-5xl md:py-14 md:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="phase3"
          >
            <Form
              address={address}
              session={session}
              setPhase={setPhase}
              setValues={setValues}
              values={values}
            />
          </motion.div>
        }

        {/* Confirmation */}
        {
          phase === 3 &&
          <motion.div
            className="border-2 border-sportsGray rounded-3xl text-center py-5 px-3 w-full md:py-14 md:px-10 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="phase4"
          >
            <Confirmation 
              status={status}
            />
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
