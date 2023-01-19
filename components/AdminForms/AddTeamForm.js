import axios from 'axios'
import { useState } from 'react'

const AddTeamForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [teamName, setTeamName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/teams/add?teamName=${teamName}`)

            if (resp.status > 200) {
                console.error(resp)
                alert('Something went wrong!')
                setFormLoading(false)
                setTeamName('')
                return
            }
            
            setFormLoading(false)
            setTeamName('')
            alert('Team Succesfully Added!')
        } catch (err) {
            setFormLoading(false)
            setTeamName('')
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2 className="mb-2">Add Team</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-semibold">Team Name</label>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                </div>
                <div className="mt-4">
                    <button disabled={formLoading} className="py-2 px-3 bg-sportsBlue text-sportsTan disabled:bg-sportsGray disabled:text-black" type="submit">{formLoading ? 'Please Wait...' : 'Add'}</button>
                </div>
            </form>
        </div>
    );
}

export default AddTeamForm;