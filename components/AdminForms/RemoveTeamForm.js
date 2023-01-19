import axios from 'axios'
import { useState } from 'react'

const RemoveTeamForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [teamName, setTeamName] = useState('')
    const [confirmation, setConfirmation] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/teams/remove?teamName=${teamName}`)

            if (resp.status > 200) {
                console.error(resp)
                alert('An unexpected error occurred!')
                setFormLoading(false)
                setTeamName('')
                setConfirmation('')
                return
            }
            
            setFormLoading(false)
            setTeamName('')
            setConfirmation('')
            alert('Team Succesfully Removed!')
        } catch (err) {
            setFormLoading(false)
            setTeamName('')
            setConfirmation('')
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2 className="">Remove Team</h2>
            <p className="text-red-500 mb-2"><strong>WARNING!</strong> Removing a team will also remove ALL Elite Scouts, Senior Scouts, and Members associated with that team!</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block font-semibold">Team Name</label>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Confirmation</label>
                    <p className="text-red-500"><i>Type &ldquo;I Understand&rdquo; in the field below to proceed</i></p>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
                </div>
                <div>
                    <button 
                        disabled={formLoading || confirmation !== "I Understand"}
                        className="py-2 px-3 bg-red-500 text-white disabled:bg-red-200 disabled:text-black" 
                        type="submit">{formLoading ? 'Please Wait...' : 'Remove'}</button>
                </div>
            </form>
        </div>
    );
}

export default RemoveTeamForm;