import React from 'react';
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion';

const SlideUpComponent = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.25,
    });

    const initialY = 100; 
    const animateY = 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: initialY }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? animateY : initialY }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}

export default SlideUpComponent;