import axios from 'axios'
import { useState } from 'react'

const UpdateUserForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [values, setValues] = useState({
        role: '',
        twitterHandle: '',
        nominatedBy: '',
        teamName: '',
        status: '',
    })

    const clearValues = () => {
        setValues({
            role: '',
            twitterHandle: '',
            nominatedBy: '',
            teamName: '',
            status: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/members/edit`, values)

            if (resp.status > 200) {
                console.error(resp)
                alert('Something went wrong!')
                setFormLoading(false)
                clearValues()
                return
            }

            setFormLoading(false)
            clearValues()
            alert('User Succesfully Updated!')
        } catch (err) {
            setFormLoading(false)
            clearValues()
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2>Edit User</h2>
            <p className="mb-2">Fill out ALL fields!</p>
            <form onSubmit={handleSubmit}>
                
                <div className="mb-2">
                    <label className="block font-semibold">New User (Twitter Handle)</label>
                    <input type="text" className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" name="twitterHandle" value={values.twitterHandle} onChange={(e) => setValues({...values, [e.target.name]: e.target.value})} placeholder="@user" required />
                </div>
                <div className="mb-2">
                    <label className="block font-semibold">Nominated By (Twitter Handle)</label>
                    <input type="text" className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" name="nominatedBy" value={values.nominatedBy} onChange={(e) => setValues({...values, [e.target.name]: e.target.value})} placeholder="@nominatedby" required />
                </div>
                <div className="mb-2">
                    <label className="block font-semibold">Role</label>
                    <select name="role" value={values.role} className="bg-white p-3 w-full max-w-lg border border-black" onChange={(e) => setValues({...values, [e.target.name]: e.target.value})} required >
                        <option value="">Select Role</option>
                        <option value="Elite Scout">Elite Scout</option>
                        <option value="Senior Scout">Senior Scout</option>
                        <option value="Member">Member</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block font-semibold">Team Name</label>
                    <input type="text" className="bg-white p-3 w-full max-w-lg border border-black placeholder:text-gray-500" name="teamName" value={values.teamName} onChange={(e) => setValues({...values, [e.target.name]: e.target.value})} required />
                </div>
                <div className="mb-2">
                    <label className="block font-semibold">Status</label>
                    <select name="status" value={values.status} className="bg-white p-3 w-full max-w-lg border border-black" onChange={(e) => setValues({...values, [e.target.name]: e.target.value})} required >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                
                <div className="mt-4">
                    <button disabled={formLoading} className="py-2 px-3 bg-sportsBlue text-sportsTan disabled:bg-sportsGray disabled:text-black" type="submit">{formLoading ? 'Please Wait...' : 'Update'}</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateUserForm;