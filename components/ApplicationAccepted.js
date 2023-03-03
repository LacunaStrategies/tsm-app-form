import { motion } from 'framer-motion'

const ApplicationAccepted = ({ heading, subHeading, content }) => {
    return (
        <motion.aside
            initial={{ scale: 1 }}
            animate={{ scale: 0.7 }}
            transition={{ delay: 4, duration: 2 }}
            className="text-white text-center"
        >
            <motion.h2
                className="text-xl font-semibold mb-2 uppercase sm:text-4xl md:text-5xl sm:mb-4 md:mb-8">{heading}</motion.h2>
            <h3 className="text-md font-semibold mb-1 sm:text-2xl md:text-3xl sm:mb-2 md:mb-4">{subHeading}</h3>
            <p className="max-w-md text-sm mb-8 mx-auto md:text-base">{content}</p>
            <div className="mt-8 mb-4 py-4 border-t border-b border-sportsGray max-w-lg mx-auto flex items-center justify-between">
                <div className="font-thin"><strong>Status:</strong></div>
                <div className="py-2 px-3 rounded-lg bg-green-600">Approved</div>
            </div>
        </motion.aside>
    )
}

export default ApplicationAccepted;