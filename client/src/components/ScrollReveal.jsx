import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollReveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  
  // Link animation directly to scroll position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.5 1"] // Starts fading when top enters bottom of screen, finishes when middle hits bottom of screen
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
