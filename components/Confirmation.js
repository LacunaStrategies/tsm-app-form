const Confirmation = ({status}) => {
    return (
        <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="uppercase font-semibold text-lg sm:text-xl mb-8">Congratulations</h2>
            <p className="font-thin text-sm mb-8">Your application has been submitted and will be reviewed by The Sports Meta team. We couldn&apos;t be more excited and we&apos;re so happy you&apos;ve chosen to embark upon this journey with us. Should you be selected you will be notified right on twitter by @TheScoutList. In the meantime, join our discord where there are opportunities to be hand selected for an Elite Scout role and keep up with us on twitter to stay connected!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <a
                    className="bg-sportsBlue text-sportsTan p-4 my-2 mx-auto rounded-lg shadow-sm shadow-black text-xl flex justify-center w-full sm:w-[150px]"
                    href="https://discord.gg/AgbRnQ9fhD"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src="/assets/images/discord-icon.webp" width={38} height={28} alt="Discord Icon" />
                    <span className="ml-2">Discord</span>
                </a>
                <a
                    className="bg-sportsBlue text-sportsTan p-4 my-2 mx-auto rounded-lg shadow-sm shadow-black text-xl flex justify-center w-full sm:w-[150px]"
                    href="https://twitter.com/TheSportsMeta"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src="/assets/images/twitter-icon.webp" width={35} height={27} alt="Twitter Icon" />
                    <span className="ml-2">Twitter</span>
                </a>
            </div>
            <div className="mt-8 mb-4 py-4 border-t border-b border-black lg:max-w-[80%] mx-auto flex items-center justify-between">
                <div className="font-thin">Status:</div>
                <div className={`py-2 px-3 rounded-lg ${status === 'Pending' ? 'bg-yellow-200 text-yellow-600' : 'bg-red-300 text-red-700'}`}>{status === 'Pending' ? 'Under Review' : 'Rejected'}</div>
            </div>
        </>
    );
}

export default Confirmation;