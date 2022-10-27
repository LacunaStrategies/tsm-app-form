// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Imports
import Image from 'next/image'

// ** NextAuth Imports
import { signOut } from 'next-auth/react'

// ** Utility Imports
import trimString from '../utils/trimString'

// ** Wagmi Imports
import { useDisconnect } from 'wagmi'

const Connections = ({ address, session }) => {

    // Hooks
    const { disconnect } = useDisconnect() 

    return (
        <div className="px-4 w-full max-w-[280px] mx-auto md:py-4">
            <div className="bg-sportsBlue text-sportsTan py-2 px-5 w-full text-center shadow-black shadow-md">
                <div className="flex items-center justify-center mb-4">
                    <Image
                        src="/assets/images/eth-icon.webp"
                        height={25}
                        width={25}
                        alt="Ethereum Icon"
                    />
                    <div className="mx-3">
                        {
                            address ? (
                                trimString(address)
                            ) : (
                                '...'
                            )
                        }
                    </div>
                    <div>
                        { 
                            address && 
                                <button onClick={() => disconnect()}>X</button>
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Image
                        src="/assets/images/twitter-icon.webp"
                        height={19}
                        width={25}
                        alt="Twitter Icon"
                    />
                    <div className="mx-3">
                        {session?.twitter.twitterHandle ? (
                            session?.twitter.twitterHandle
                        ) : (
                            '...'
                        )}
                    </div>
                    <div>
                        { 
                            session && 
                                <button onClick={() => signOut()}>X</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Connections;