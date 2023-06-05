import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ApplicationAccepted = ({ heading, subHeading, content }) => {

    const [showHeading, setShowHeading] = useState(false)

    return (
        <aside className="text-white text-center">
            <motion.h2
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{ opacity: 0, scale: 0.7, height: 0, marginBottom: 0, y: -75}}
                transition={{ delay: 4, duration: 1.5 }}
                className="text-xl font-semibold mb-2 uppercase sm:text-4xl md:text-5xl sm:mb-4 md:mb-8"
            >
                {heading}
            </motion.h2>
            <h3 className="text-md font-semibold mb-1 sm:text-2xl md:text-3xl sm:mb-2 md:mb-4">{subHeading}</h3>
            <p className="max-w-md text-sm mb-8 mx-auto md:text-base">{content}</p>
            <div className="mt-8 mb-4 py-4 border-t border-b border-sportsGray max-w-lg mx-auto flex items-center justify-between">
                <div className="font-thin"><strong>Status:</strong></div>
                <div className="py-2 px-3 rounded-lg bg-green-600">Approved</div>
            </div>
        </aside>
    )
}

export default ApplicationAccepted