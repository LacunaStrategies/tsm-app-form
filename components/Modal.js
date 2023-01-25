// ** Framer Motion Import
import { motion } from 'framer-motion'

// ** React Imports
import { useState } from 'react'

// ** Axios Import
import axios from 'axios'

// ** Component Imports
import Backdrop from './Backdrop'
import Image from 'next/image';

// Framer Motion Animation
const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 1,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
};


const Modal = ({ handleClose, type, teamMembers, setTeamMembers }) => {

    // State Variables
    const [values, setValues] = useState({
        seniorScout1: '',
        seniorScout2: '',
        member: '',
    })
    const [formLoading, setFormLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const clearForm = () => {
        setFormLoading(false)
        setValues({
            seniorScout1: '',
            seniorScout2: '',
            member: '',
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/nominate?seniorScout1=${values.seniorScout1}&seniorScout2=${values.seniorScout2}&member=${values.member}&type=${type}`)

            if (resp.status > 200) {
                console.error(resp)
                clearForm()
                alert('An Unexpected Error Occurred!')
            }

            const { insertData } = resp.data

            setTeamMembers([...teamMembers, ...insertData])

            clearForm()
            setSubmitted(true)

        } catch (err) {
            alert(err.response?.data.message || err.message)
            console.error(err)
            clearForm()
        }
    }

    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-sportsBlue text-white py-10 px-4 sm:p-14 max-w-3xl rounded-2xl md:rounded-[5rem] shadow-black shadow-2xl mx-auto"
            >
                <button
                    className="absolute top-2 right-4 md:top-6 md:right-14 text-2xl font-semibold"
                    onClick={handleClose}
                >X</button>

                {!submitted ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="uppercase text-xl sm:text-2xl mb-4">Nominate Below</h2>
                            {
                                type === "Senior Scout" && <p className="font-light">Nominate two Senior Scouts below using their Twitter handle. DO NOT nominate someone you do not know. All nominations will be reviewed. Once your submission is approved by the team, your nomination will be tweeted by @TheScoutList to notify your nominations to accept their role on your team. Choose wisely, each senior scout will be able to nominate one person each to your team and everyone on your team will be added to the Roster (allowlist). This group will be your team for all future competitions.</p>
                            }
                            {
                                type === "Member" && <p className="font-light">Nominate on Member below using their Twitter handle. DO NOT nominate someone you do not know. All nominations will be reviewed. Once your submission is approved by the team, your nomination will be tweeted by @TheScoutList to notify your nominations to accept their role on your team. Choose wisely, this member will be added to the Roster (allowlist) and be part of your team for all future competitions.</p>
                            }
                        </div>

                        <form className="flex flex-wrap text-center" onSubmit={handleSubmit}>
                            {
                                type === "Senior Scout" && (
                                    <div className="w-full md:w-1/2">
                                        <div className="mb-8">
                                            <label className="block font-semibold text-lg sm:text-2xl mb-2">Senior Scout #1</label>
                                            <input type="text" className="w-full max-w-xs p-2 text-black" name="seniorScout1" id="seniorScout1" value={values.seniorScout1} onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} placeholder="@TwitterHandle" required />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-lg sm:text-2xl mb-2">Senior Scout #2</label>
                                            <input type="text" className="w-full max-w-xs p-2 text-black" name="seniorScout2" id="seniorScout2" value={values.seniorScout2} onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} placeholder="@TwitterHandle" required />
                                        </div>
                                    </div>
                                )
                            }
                            {
                                type === "Member" && (
                                    <div className="w-full md:w-1/2">
                                        <div>
                                            <label className="block font-semibold text-lg sm:text-2xl mb-2">Member</label>
                                            <input type="text" className="w-full max-w-xs p-2 text-black" name="member" value={values.member} onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} placeholder="@TwitterHandle" required />
                                        </div>
                                    </div>
                                )
                            }
                            <div className="flex items-center w-full mt-8 px-8 md:mt-0 md:w-1/2 ">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="block mx-auto text-3xl font-bold py-5 px-6 w-full max-w-xs text-center shadow-[0_0_10px_0_rgba(0,0,0,1)] rounded-2xl disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-gray-500"
                                >
                                    {formLoading ? 'Please Wait...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="md:my-14">
                        <div className="text-center mb-14">
                            <h2 className="uppercase text-xl sm:text-2xl mb-4">Submitted</h2>
                            <p className="font-light">Your nominations are being reviewed by your team. If approved, nominations will be tweeted by @TheScoutList with you tagged. Don&apos;t forget to join our Discord and follow our twitter to stay connected.</p>
                        </div>
                        <div className="sm:flex sm:justify-center">
                            <a href="#" className="flex items-center justify-center max-w-[200px] mx-auto sm:mx-0 py-4 px-6 mb-8 sm:mb-0 sm:mr-10 shadow-[0_0_8px_0_rgba(0,0,0,0.60)] border border-[rgba(150,150,150,0.25)] rounded-md" title="Follow The Sports Metaverse on Discord">
                                <Image src="/assets/images/discord-icon.webp" height={28} width={38} alt="Discord Icon" />
                                <span className="ml-4 text-xl">Discord</span>
                            </a>
                            <a href="#" className="flex items-center justify-center max-w-[200px] mx-auto sm:mx-0 py-4 px-6 sm:mr-10 shadow-[0_0_8px_0_rgba(0,0,0,0.60)] border border-[rgba(150,150,150,0.25)] rounded-md" title="Follow The Sports Metaverse on Twitter">
                                <Image src="/assets/images/twitter-icon.webp" height={27} width={35} alt="Twitter Icon" />
                                <span className="ml-4 text-xl">Twitter</span>
                            </a>
                        </div>
                    </div>
                )}

            </motion.div>
        </Backdrop>
    );
};


export default Modal