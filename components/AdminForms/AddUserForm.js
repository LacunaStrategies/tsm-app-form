
import axios from 'axios'
import { useState } from 'react'

const AddUserForm = () => {

    const [formLoading, setFormLoading] = useState(false)
    const [values, setValues] = useState({
        role: '',
        twitterHandle: '',
        nominatedBy: '',
        teamName: '',
    })

    const clearValues = () => {
        setValues({
            role: '',
            twitterHandle: '',
            nominatedBy: '',
            teamName: '',
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFormLoading(true)

        try {
            const resp = await axios.post(`/api/members/add`, values)

            if (resp.status > 200) {
                console.error(resp)
                alert('Something went wrong!')
                setFormLoading(false)
                clearValues()
                return
            }

            setFormLoading(false)
            clearValues()
            alert('User Succesfully Added!')
        } catch (err) {
            setFormLoading(false)
            clearValues()
            alert(err.response.data.message || err.message)
        }
    }

    return (
        <div className="mt-10 container mx-auto">
            <h2 className="mb-2">Add User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block font-semibold">User To Update (Twitter Handle)</label>
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
                
                <div className="mt-4">
                    <button disabled={formLoading} className="py-2 px-3 bg-sportsBlue text-sportsTan disabled:bg-sportsGray disabled:text-black" type="submit">{formLoading ? 'Please Wait...' : 'Add'}</button>
                </div>
            </form>
        </div>
    );
}

export default AddUserForm;