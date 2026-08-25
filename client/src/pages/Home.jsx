import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../context/IdentityContext';
import PageTransition from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const navigate = useNavigate();
  const { setIdentity } = useIdentity();
  
  const [transitionState, setTransitionState] = useState({ active: false, targetIdentity: null, x: 0, y: 0 });
  
  const handleSelect = (e, selectedIdentity) => {
    setTransitionState({ active: true, targetIdentity: selectedIdentity, x: e.clientX, y: e.clientY });
    
    setTimeout(() => {
      setIdentity(selectedIdentity);
      navigate('/portfolio');
    }, 800);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Atanu Ghosh | Choose Your Path</title>
        <meta name="description" content="Welcome to the interactive portfolio of Atanu Ghosh. Choose between my Electrical Engineering or Full Stack Developer identities." />
      </Helmet>
      <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-zinc-50 dark:bg-black font-mono relative">
        {/* Engineering Side */}
        <div 
          className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={(e) => handleSelect(e, 'engineering')}
        >
          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors uppercase tracking-widest">
              Electrical<br />Engineer
            </h1>
          </div>
        </div>

        {/* Developer Side */}
        <div 
          className="flex-1 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={(e) => handleSelect(e, 'developer')}
        >
          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-widest">
              Full Stack<br />Developer
            </h1>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {transitionState.active && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${transitionState.x}px ${transitionState.y}px)` }}
            animate={{ clipPath: `circle(3000px at ${transitionState.x}px ${transitionState.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 pointer-events-none ${transitionState.targetIdentity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500'}`}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Home;
