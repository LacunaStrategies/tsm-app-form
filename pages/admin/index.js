import Link from "next/link"

const AdminPage = () => {
    return (
        <div className="container px-4 py-8 mx-auto">
            <h1>Admin Pages</h1>

            <ul className="list-disc pl-10 mt-4">
                <li>
                    <Link href="/admin/applications"><a className="transition-all duration-300 underline text-blue-500 hover:text-blue-900">Review Applications</a></Link>
                </li>
                <li>
                    <Link href="/admin/nominations"><a className="transition-all duration-300 underline text-blue-500 hover:text-blue-900">Review Nominations</a></Link>
                </li>
                <li>
                    <Link href="/admin/manage-brackets"><a className="transition-all duration-300 underline text-blue-500 hover:text-blue-900">Manage Teams &amp; Users</a></Link>
                </li>
                {/* 
                <li>
                    <Link href="/admin/twitterNotifications"><a className="transition-all duration-300 underline text-blue-500 hover:text-blue-900">Manage Twitter Notifications</a></Link>
                </li> 
                */}
            </ul>
        </div>
    )
}

export default AdminPage