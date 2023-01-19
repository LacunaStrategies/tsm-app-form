import axios from 'axios'
import { useState } from 'react'

const RemoveUserForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [twitterHandle, setTwitterHandle] = useState('')
    const [confirmation, setConfirmation] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/members/remove?twitterHandle=${twitterHandl}`)

            if (resp.status > 200) {
                console.error(resp)
                alert('An unexpected error occurred!')
                setFormLoading(false)
                setTwitterHandle('')
                setConfirmation('')
                return
            }
            
            setFormLoading(false)
            setTwitterHandle('')
            setConfirmation('')
            alert('Team Succesfully Removed!')
        } catch (err) {
            setFormLoading(false)
            setTwitterHandle('')
            setConfirmation('')
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2 className="">Remove User</h2>
            <p className="text-red-500 mb-2"><strong>WARNING!</strong> Removing a user will completely delete their record and can not be un-done!</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block font-semibold">Twitter Handle</label>
                    <input className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" type="text" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@twitterhandle" required />
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

export default RemoveUserForm;