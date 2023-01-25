// ** React Import
import { useState } from "react";

// ** Axios Import
import axios from 'axios'

const NominationForm = ({ type }) => {

    // State Variables
    const [seniorScout1, setSeniorScout1] = useState()
    const [seniorScout2, setSeniorScout2] = useState()
    const [member, setMember] = useState()
    const [formLoading, setFormLoading] = useState(false)

    const handleSubmit = async () => {
        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/nominate?seniorScout1=${seniorScout1}&seniorScout2=${seniorScout2}&member=${member}&type=${type}`)

            if (resp.status > 200) {
                console.error(resp)
                setFormLoading(false)
                alert('An Unexpected Error Occurred!')
            }

            console.log(resp)
            setFormLoading(false)

        } catch (err) {
            console.error(err)
            setFormLoading(false)
        }
    }
    return (
        <div className="fixed z-50 top-0 flex min-h-screen h-full w-full items-start md:items-center text-white overflow-scroll px-4 py-4">
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-white opacity-50"></div>
            <div className="relative bg-sportsBlue py-10 px-4 sm:py-8 sm:px-14 max-w-3xl rounded-2xl md:rounded-[5rem] shadow-black shadow-2xl mx-auto" id="formWrapper">
                <button
                    className="absolute top-2 right-4 md:top-6 md:right-14 text-2xl font-semibold"
                    onClick={() => setShow(false)}>X</button>
                <div className="text-center mb-8" id="formHeader">
                    <h2 className="uppercase text-xl sm:text-2xl mb-4">Nominate Below</h2>
                    {
                        type === "senior" && <p className="font-light">Nominate two Senior Scouts below using their Twitter handle. DO NOT nominate someone you do not know. All nominations will be reviewed. Once your submission is approved by the team, your nomination will be tweeted by @TheScoutList to notify your nominations to accept their role on your team. Choose wisely, each senior scout will be able to nominate one person each to your team and everyone on your team will be added to the Roster (allowlist). This group will be your team for all future competitions.</p>
                    }
                    {
                        type === "member" && <p>Nominate on Member below using their Twitter handle. DO NOT nominate someone you do not know. All nominations will be reviewed. Once your submission is approved by the team, your nomination will be tweeted by @TheScoutList to notify your nominations to accept their role on your team. Choose wisely, this member will be added to the Roster (allowlist) and be part of your team for all future competitions.</p>
                    }
                </div>

                <form className="flex flex-wrap" onClick={handleSubmit}>
                    {
                        type === "senior" && (
                            <div className="w-full md:w-1/2 text-center">
                                <div className="mb-8">
                                    <label className="block font-semibold text-lg sm:text-2xl">Senior Scout #1</label>
                                    <input type="text" className="w-full max-w-xs p-2 text-black" name="seniorScout1" id="seniorScout1" value={seniorScout1} onChange={(e) => setSeniorScout1(e.target.value)} placeholder="@TwitterHandle" required />
                                </div>
                                <div>
                                    <label className="block font-semibold text-lg sm:text-2xl">Senior Scout #2</label>
                                    <input type="text" className="w-full max-w-xs p-2" name="seniorScout2" id="seniorScout2" value={seniorScout2} onChange={(e) => setSeniorScout2(e.target.value)} placeholder="@TwitterHandle" required />
                                </div>
                            </div>
                        )
                    }
                    {
                        type === "member" && (
                            <div className="w-full md:w-1/2 text-center">
                                <div>
                                    <label className="block font-semibold text-3xl">Member</label>
                                    <input type="text" className="w-full max-w-xs p-2" name="member" id="member" value={member} onChange={(e) => setMember(e.target.value)} placeholder="@TwitterHandle" required />
                                </div>
                            </div>
                        )
                    }
                    <div className="w-full mt-8 px-8 md:mt-0 md:w-1/2  flex items-center">
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="block mx-auto text-3xl font-bold py-5 px-6 w-full max-w-xs text-center shadow-[0_0_10px_0_rgba(0,0,0,1)] rounded-2xl disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-gray-500"
                        >
                            <div>
                                {formLoading ? 'Please Wait...' : 'Submit'}
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NominationForm;