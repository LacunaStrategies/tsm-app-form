const Bracket = ({ type, twitterHandle, imgSrc, isUser, canNominate, walkthrough, setWalkthrough, open, status }) => {
    return (
        <>
            {/* Walkthrough Overlay - Step 1 */}
            {
                isUser && walkthrough === 1 && (
                    <div className="absolute z-30 text-4xl -top-[120%] -left-8 uppercase">
                        This is <span className="font-bold">You</span>!
                        <button className="absolute top-full -right-8 text-2xl" onClick={() => setWalkthrough(2)}>NEXT &rarr;</button>
                    </div>
                )
            }

            {/* Walkthrough Overlay - Step 2 */}
            {
                canNominate && walkthrough === 2 && (
                    <div className="absolute z-30 text-3xl -top-full left-2 uppercase font-bold w-full">Click to Nominate!</div>
                )
            }

            {/* Bracket */}
            <div
                onClick={canNominate && !twitterHandle ? () => open(type) : null}
                className={`
                    relative rounded-lg py-2 px-10 w-full min-w-[220px] max-w-[300px] text-center mx-auto mt-7 border border-white lg:mt-0
                    ${isUser && walkthrough === 1 ? 'z-20 shadow-white shadow-md'
                        : canNominate && walkthrough === 2 ? 'z-20'
                            : ''
                    } 
                    ${canNominate && !twitterHandle ? 'transition-all bg-[#7f7f7f] uppercase cursor-pointer shadow-black shadow-2xl border-black'
                        : isUser ? 'bg-green-600'
                            : twitterHandle && status !== 'accepted' ? 'bg-[#7f7f7f]'
                                : twitterHandle ? 'bg-yellow-500'
                                    : 'bg-[#7f7f7f]'
                    }
                `}
            >

                {/* Bracket Label */}
                <div className="absolute w-full text-center text-sm left-0 -top-5">{type}</div>

                {/* Elite Scout Icon */}
                {
                    type === "Elite Scout" && (
                        <div className="absolute top-[2px] left-[2px] -rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                            </svg>
                        </div>
                    )
                }

                {/* Bracket Content */}
                <div className={`flex flex-col sm:flex-row items-center justify-center min-h-[70px] ${canNominate && !twitterHandle ? 'animate-pulse text-yellow-400 font-normal' : ''}`}>
                    {
                        canNominate && !twitterHandle ? <span>Nominate</span>
                            : twitterHandle && status === 'nominated' ? 'Pending Review...'
                                : twitterHandle && status === 'approved' ? 'Awaiting Acceptance...'
                                    : twitterHandle ? (
                                        <>
                                            <img src={imgSrc || "https://via.placeholder.com/70"} width={70} height={70} alt={`${twitterHandle} Profile Picture`} className="rounded-full mx-auto sm:mx-0" />
                                            <span className="mt-2 overflow-ellipsis sm:mt-0 sm:ml-6">@{twitterHandle}</span>
                                        </>
                                    ) : 'Awaiting Nomination...'

                    }
                </div>
            </div>
        </>
    );
}

export default Bracket;