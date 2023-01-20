const Bracket = ({ type, twitterHandle, imgSrc, canNominate }) => {
    return (
        <div className="relative rounded-lg bg-yellow-500 py-2 px-10 w-full text-center mt-7 lg:mt-0" onClick={null}>
            <div className="absolute w-full text-center text-sm left-0 -top-5">{type}</div>
            {
                type === "Elite Scout" && (
                    <div className="absolute top-[2px] left-[2px] -rotate-45">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                    </div>
                )
            }
            <div className="flex flex-col sm:flex-row items-center justify-center min-h-[70px]">
                {
                    twitterHandle ? (
                        <>
                            <img src={imgSrc} width={70} height={70} alt={`${twitterHandle} Profile Picture`} className="rounded-full mx-auto sm:mx-0" />
                            <span className="mt-2 overflow-ellipsis sm:mt-0 sm:ml-6">{twitterHandle}</span>
                        </>
                    ) : 'Nominate'
                }
            </div>
        </div>
    );
}

export default Bracket;