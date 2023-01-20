import ApplicationAccepted from "../components/ApplicationAccepted"
import Brackets from "../components/Brackets"

function MyTeam({ data }) {

    return (
        <div className="bg-sportsBlue min-h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 py-8">
                <ApplicationAccepted
                    heading='Congratulations'
                    subHeading='You Made The Cut 🎉'
                    content='Welcome Elite Scout, your application has been selected. Now, the real fun starts. Use chart below to BUILD YOUR TEAM.'
                />
                <Brackets />
            </div>
        </div>
    )
}

// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    // const res = await fetch(`https://.../data`)
    // const data = await res.json()

    const data = {}

    // Pass data to the page via props
    return { props: { data } }
}

export default MyTeam