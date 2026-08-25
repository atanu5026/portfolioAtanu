import React from 'react';
import { motion } from 'framer-motion';
import { useIdentity } from '../context/IdentityContext';

const Loader = () => {
  const { identity } = useIdentity();
  
  // Default to a neutral color if identity is somehow not set during initial load
  const accentColor = identity === 'engineering' ? 'bg-orange-500' : identity === 'developer' ? 'bg-blue-500' : 'bg-white';
  const textColor = identity === 'engineering' ? 'text-orange-500' : identity === 'developer' ? 'text-blue-500' : 'text-white';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative flex items-center justify-center h-24 w-24 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-r-2 border-slate-800 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className={`absolute inset-4 border-b-2 border-l-2 rounded-full border-current ${textColor}`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className={`w-2 h-2 rounded-full ${accentColor}`}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
        className={`font-mono text-xs tracking-[0.3em] uppercase ${textColor}`}
      >
        Initializing System...
      </motion.div>
    </div>
  );
};

export default Loader;
