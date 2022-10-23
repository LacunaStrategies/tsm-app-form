import { useEffect, useState } from 'react'
import { useConnect} from 'wagmi'

const WagmiConnect = () => {

    const [isMounted, setIsMounted] = useState(false)
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted)
        return

    return (
        <>
            <h2 className="text-xl font-bold uppercase mb-4">Begin Your Application</h2>
            <p className="mb-12 font-thin max-w-sm">Connect your Ethereum Wallet to start your journey. Practice good habits and connect with a burner wallet.</p>

            {connectors.map((connector) => (
                <button
                    className="bg-sportsBlue text-sportsTan p-5 my-2 mx-auto rounded-lg shadow-sm shadow-black block w-[200px] text-xl disabled:bg-gray-400"
                    disabled={!connector.ready || isLoading || connector.id === pendingConnector?.id}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (connecting)'}
                </button>
            ))}

            {error && <div>{error.message}</div>}
        </>
    )
}

export default WagmiConnect