import Link from 'next/link'
import AddTeamForm from "../../../components/AdminForms/AddTeamForm"
import AddUserForm from "../../../components/AdminForms/AddUserForm"
import RemoveTeamForm from "../../../components/AdminForms/RemoveTeamForm"
import RemoveUserForm from "../../../components/AdminForms/RemoveUserForm"
import UpdateTeamForm from "../../../components/AdminForms/UpdateTeamForm"
import UpdateUserForm from "../../../components/AdminForms/UpdateUserForm"


export default function Home() {
    return (
        <div className="container mx-auto px-14 py-8">
            <div>
                <Link href="/admin"><a className="inline-block transition-all duration-300 mb-8 py-2 px-5 bg-blue-500 text-white hover:bg-blue-900">Back to Admin</a></Link>
            </div>

            <h1 className="mb-12 text-3xl">Admin - Manage Brackets</h1>

            <div className="my-4 py-4 border-b-2 border-b-black border-t-2 border-t-black">
                <h2 className="text-xl">Manage Users</h2>
                <AddUserForm />
                <UpdateUserForm />
                <RemoveUserForm />
            </div>


            <div className="mb-4 pb-4 border-b-2 border-b-black">
                <h2 className="text-xl">Manage Teams</h2>
                <AddTeamForm />
                <UpdateTeamForm />
                <RemoveTeamForm />
            </div>

        </div >
    )
}