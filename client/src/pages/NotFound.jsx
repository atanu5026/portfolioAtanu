import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus terminal input
    const focusInput = () => {
      if (inputRef.current) inputRef.current.focus();
    };
    document.addEventListener('click', focusInput);
    return () => document.removeEventListener('click', focusInput);
  }, []);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = terminalText.toLowerCase().trim();
    if (cmd === 'home' || cmd === 'exit' || cmd === 'cd /') {
      navigate('/');
    } else {
      setTerminalText('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Matrix/Glitch effects can go here */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #22c55e 0%, transparent 50%)' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center mb-12 relative"
      >
        <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter mix-blend-screen text-red-600 animate-pulse relative">
          <span className="absolute inset-0 text-blue-500 translate-x-[5px] opacity-70">404</span>
          <span className="absolute inset-0 text-green-500 -translate-x-[5px] opacity-70">404</span>
          404
        </h1>
        <p className="text-xl md:text-3xl font-bold uppercase tracking-[0.5em] text-white mt-4">System Failure</p>
        <p className="text-sm md:text-base text-slate-500 tracking-widest mt-4 max-w-xl mx-auto">
          The requested sector does not exist in the current memory bank. 
          Return to root directory immediately to avoid data corruption.
        </p>
      </motion.div>

      <div className="z-10 w-full max-w-md bg-zinc-950 border border-green-900 p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        <p className="text-xs text-green-700 uppercase tracking-widest mb-4">Emergency Protocol Interface</p>
        <div className="text-sm mb-4">
          <span className="text-slate-400">Available commands:</span><br/>
          <span className="text-white">- home</span> (Restore system state)
        </div>
        
        <form onSubmit={handleCommand} className="flex gap-2">
          <span>root@system:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={terminalText}
            onChange={(e) => setTerminalText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white font-bold"
            autoFocus
          />
        </form>
      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-8 text-xs font-mono tracking-widest text-slate-600 hover:text-white transition-colors"
      >
        [ FORCE REBOOT ]
      </button>

    </div>
  );
};

export default NotFound;
