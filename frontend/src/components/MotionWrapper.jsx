import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const MotionWrapper = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper; 