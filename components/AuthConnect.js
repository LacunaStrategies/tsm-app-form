import { signIn } from 'next-auth/react'

const AuthConnect = ({ session }) => {


    return (
        <>
            <h2 className="text-xl font-bold uppercase mb-4">Connect Your Twitter</h2>
            <p className="mb-12 font-thin max-w-sm">This will help us confirm your identity.</p>
            {session ? (
                <button
                    disabled={true}
                    className="bg-sportsBlue text-sportsTan p-5 my-2 mx-auto rounded-lg shadow-sm shadow-black block w-[200px] text-xl disabled:bg-gray-400"
                >
                    Twitter Connected!
                </button>
            ) : (
                <button
                    className="bg-sportsBlue text-sportsTan p-5 my-2 mx-auto rounded-lg shadow-sm shadow-black block w-[200px] text-xl disabled:bg-gray-400"
                    onClick={() => signIn('twitter')}
                >
                    Connect Twitter
                </button>
            )}

        </>
    )
}

export default AuthConnect;