import { motion } from 'framer-motion'

const Backdrop = ({ children, onClick }) => {

    return (
        <motion.div
            onClick={onClick}
            className="fixed flex items-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-50 z-30 overflow-y-scroll px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}

export default Backdrop