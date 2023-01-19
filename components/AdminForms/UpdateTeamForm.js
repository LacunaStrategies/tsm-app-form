import axios from 'axios'
import { useState } from 'react'

const UpdateTeamForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [oldTeamName, setOldTeamName] = useState('')
    const [newTeamName, setNewTeamName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/teams/edit?oldTeamName=${oldTeamName}&newTeamName=${newTeamName}`)

            if (resp.status > 200) {
                console.error(resp)
                alert('An Unexpected Error Occurred!')
                setFormLoading(false)
                setOldTeamName('')
                setNewTeamName('')
                return
            }

            setFormLoading(false)
            setOldTeamName('')
            setNewTeamName('')
            alert('Team Succesfully Updated!')
        } catch (err) {
            setFormLoading(false)
            setOldTeamName('')
            setNewTeamName('')
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2 className="mb-2">Edit Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-semibold">Current Team Name</label>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={oldTeamName} onChange={(e) => setOldTeamName(e.target.value)} required />
                </div>
                <div>
                    <label className="block font-semibold">New Team Name</label>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required />
                </div>
                <div className="mt-4">
                    <button disabled={formLoading} className="py-2 px-3 bg-sportsBlue text-sportsTan disabled:bg-sportsGray disabled:text-black" type="submit">{formLoading ? 'Please Wait...' : 'Edit'}</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateTeamForm;