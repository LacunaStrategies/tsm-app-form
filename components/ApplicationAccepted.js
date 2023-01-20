const ApplicationAccepted = ({ heading, subHeading, content }) => {

    return (
        <aside
            className="text-white text-center"
        >
            <h2 className="text-xl font-semibold mb-2 uppercase sm:text-4xl md:text-5xl sm:mb-4 md:mb-8">{heading}</h2>
            <h3 className="text-md font-semibold mb-1 sm:text-2xl md:text-3xl sm:mb-2 md:mb-4">{subHeading}</h3>
            <p className="max-w-md text-sm mb-8 mx-auto">{content}</p>
            <div className="mt-8 mb-4 py-4 border-t border-b border-sportsGray max-w-lg mx-auto flex items-center justify-between">
                <div className="font-thin"><strong>Status:</strong></div>
                <div className="py-2 px-3 rounded-lg bg-green-600">Approved</div>
            </div>
        </aside>
    )
}

export default ApplicationAccepted;