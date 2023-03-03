import Link from "next/link"

const AdminPage = () => {
    return (
        <div className="container px-4 py-8 mx-auto">
            <h1>Admin Pages</h1>

            <ul>
                <li>
                    <Link href="/applications">Review Applications</Link>
                </li>
                <li>
                    <Link href="/applications">Review Nominations</Link>
                </li>
                <li>
                    <Link href="/manage-brackets">Manage Teams &amp; Users</Link>
                </li>
                <li>
                    <Link href="#">Manage Twitter Notifications</Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminPage