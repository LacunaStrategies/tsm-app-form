import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios'

const questionOneOptions = [
    {
        label: "Builder/Creator",
        desc: "You like to create something out of nothing and you want to shill that sh*t to VIPs...err, network.",
    },
    {
        label: "Artist",
        desc: "In a troubled world, you create things that are beautiful. Painter, illustrator, animator, digital, AI, etc.",
    },
    {
        label: "Trader",
        desc: "The last time you got a full nights sleep you missed out on Goblintown. Never again. We see you, degen.",
    },
    {
        label: "Content Creator",
        desc: "Copywriter, Twitter threads, breakdowns, writeups, You keep CT on their toes.",
    },
    {
        label: "Community Champion",
        desc: "So you're the one that was keeping the chat alive at 3am. You find a community you love and vibe.",
    },
    {
        label: "Soul Eating Famous Person",
        desc: "You're famous but you're secretly a spy sent by the illuminati to report back on the groundbreaking developments of The Sports Meta. Go right on ahead.",
    },
    {
        label: "Other",
        desc: "You walk a different path than those set out above. You're a lone wolf. You carve your own category.",
    },
]

const Form = ({ address, session, setPhase, setStatus, setValues, values }) => {

    // States
    const [canProgress, setCanProgress] = useState(false)
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [submitting, setSubmitting] = useState(false)


    useEffect(() => {
        if (values[`q${activeQuestion}`] !== '' || activeQuestion === 7) {
            setCanProgress(true)
        } else {
            setCanProgress(false)
        }
    }, [activeQuestion, values])

    /**
     * * handlePrev
     * @dev Decrement active form question by 1
     */
    const handlePrev = () => {
        setActiveQuestion(activeQuestion - 1)
    }

    /**
     * * handleNext
     * @dev Increment active form question by 1
     */
    const handleNext = () => {
        setActiveQuestion(activeQuestion + 1)
    }

    /**
     * * handleQ1Selection
     * @dev Apply question 1 selection to values state and increment active question
     * @params {string} selection
     */
    const handleQ1Selection = (selection) => {
        setValues({ ...values, q1: selection })
        setActiveQuestion(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {

            const resp = await axios.post('/api/submit', { ...values, wallet: address, twitter: session.twitter.twitterHandle })

            console.log(resp.data)

            if (resp.status > 200) {
                alert(`Error! ${resp.data.message}`)
                setSubmitting(false)

                return
            }
            setStatus('Pending')
            setPhase(3)
            setSubmitting(false)

        } catch (error) {
            console.error(error)
            alert(`Error! ${error.response.data.message}`)
            setSubmitting(false)
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                {
                    activeQuestion > 0 && (
                        <div className="font-thin text-gray-400 mb-4">
                            Question {activeQuestion} of 7
                        </div>
                    )
                }

                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    {
                        activeQuestion === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q2"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">What&apos;s Your Discord?</h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">Enter your Discord ID Below (ex. elitescout#7777)</div>
                                <div id="questionContent">
                                    <input
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        onChange={(e) => setValues({ ...values, q0: e.target.value })}
                                        value={values.q0}
                                        placeholder="Discord ID"
                                        maxLength={500}
                                    />
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q1"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">What best describes you?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">We know you can&apos;t be defined by one category, but choose what you care about the most.</div>
                                <div id="questionContent">
                                    <div className="flex flex-wrap justify-between">
                                        {
                                            questionOneOptions.map((question, i) => (
                                                <div
                                                    key={i}
                                                    className="mb-8 w-full sm:w-1/2 px-4 lg:w-1/3 lg:last:mx-auto lg:last:justify-self-center"
                                                >
                                                    <button
                                                        className={`transition-all bg-sportsBlue text-sportsTan p-3 text-left shadow-black shadow-sm rounded-md ${question.label === values.q1 && 'border-2 border-red-600'} w-full sm:min-h-[140px] hover:bg-[#324158]`}
                                                        type="button"
                                                        onClick={() => { handleQ1Selection(question.label) }}
                                                    >
                                                        <div id="optionCard__title" className="text-white font-bold">{question.label}</div>
                                                        <div id="optionCard__desc" className="font-thin text-sm">{question.desc}</div>
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q2"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">What do you love about <br /> Web3 and what would you change?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">The Twitter battles, spaces, IRL meetups, panels with people that don&apos;t own an NFT? Our little paradise, right?</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q2: e.target.value })}
                                        value={values.q2}
                                        placeholder="Answer here..."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 3 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q3"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">What are you working on?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">Tell us about something you&apos;re building, doing, your goals, etc.</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q3: e.target.value })}
                                        value={values.q3}
                                        placeholder="Answer here..."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 4 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q4"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">Why do you want to be in The Sports Metaverse?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">What you hope to get out of this community and what you hope to add.</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q4: e.target.value })}
                                        value={values.q4}
                                        placeholder="Answer here..."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 5 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q5"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">What&apos;s your favorite sports team (1 only please)?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">	Please don&apos;t tell us it&apos;s the Dallas Cowboys.</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q5: e.target.value })}
                                        value={values.q5}
                                        placeholder="Answer here..."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 6 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q6"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">If chosen, who would you recruit to be on your scout team (2 friends)?<span className="text-red-700">*</span></h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">Who you think would be a good addition to our community. Please add their Twitter handles, if applicable.</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q6: e.target.value })}
                                        value={values.q6}
                                        placeholder="Answer here..."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeQuestion === 7 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="q7"
                            >
                                <h2 id="questionTitle" className="font-semibold uppercase text-xl mb-4 max-w-lg mx-auto">Share some links of some cool things you&apos;re doing</h2>
                                <div id="questionDesc" className="mb-9 max-w-sm mx-auto font-thin text-sm">Not required, but we&apos;d love to see what you&apos;ve been working on and what you&apos;re passionate about.</div>
                                <div id="questionContent">
                                    <textarea
                                        className="border border-sportsGray outline-none rounded-xl p-9 w-full max-w-xl bg-transparent"
                                        rows={8}
                                        onChange={(e) => setValues({ ...values, q7: e.target.value })}
                                        value={values.q7}
                                        placeholder="https://www.example.com, https://www.example2.com, etc."
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>


                <div className="flex flex-col w-full max-w-lg mx-auto text-xl font-bold mt-8 sm:flex-row sm:space-between">
                    {   // Previous Button
                        activeQuestion > 0 &&
                        <button
                            type="button"
                            className="mx-auto bg-sportsBlue text-sportsTan p-3 my-2 rounded-lg shadow-sm shadow-black block w-full max-w-[200px] text-xl disabled:bg-gray-400"
                            onClick={() => handlePrev()}
                        >
                            Prev
                        </button>
                    }
                    {   // Next Button
                        (activeQuestion >= 0 && activeQuestion < 7) &&
                        <button
                            disabled={!canProgress}
                            className="mx-auto bg-sportsBlue text-sportsTan p-3 my-2 rounded-lg shadow-sm shadow-black block w-full max-w-[200px] text-xl disabled:bg-gray-400"
                            type="button"
                            onClick={() => handleNext()}
                        >
                            Next
                        </button>
                    }
                    {   // Submit Button
                        activeQuestion === 7 &&
                        <button
                            disabled={submitting}
                            type="submit"
                            className="mx-auto bg-green-700 text-sportsTan p-3 my-2 rounded-lg shadow-sm shadow-black block w-full max-w-[200px] text-xl disabled:bg-gray-400"
                        >
                            {submitting ? 'Please wait...' : 'Submit'}
                        </button>
                    }
                </div>
            </form>

        </>
    );
}

export default Form;
