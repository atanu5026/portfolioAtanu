import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../context/IdentityContext';
import { createPortal } from 'react-dom';
import SecretLogin from '../components/SecretLogin';
import ArcadeSidebar from '../components/games/ArcadeSidebar';
import HiddenTerminal from '../components/HiddenTerminal';
import Cursor from '../components/Cursor';

const MainLayout = ({ children }) => {
  const { identity, setIdentity } = useIdentity();
  const [transitionState, setTransitionState] = useState({ active: false, targetIdentity: null, x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.classList.remove('identity-engineering', 'identity-developer');
    document.documentElement.classList.add(`identity-${identity}`);
  }, [identity]);

  const handleSwitch = (e) => {
    const targetIdentity = identity === 'engineering' ? 'developer' : 'engineering';
    setTransitionState({ active: true, targetIdentity, x: e.clientX, y: e.clientY });
    
    setTimeout(() => {
      setIdentity(targetIdentity);
      setTransitionState(prev => ({ ...prev, active: false }));
    }, 800);
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { offset: -100 });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for navbar
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const hoverColor = identity === 'engineering' ? 'hover:text-orange-600' : 'hover:text-blue-600';
  const hoverBorderColor = identity === 'engineering' ? 'hover:border-orange-600' : 'hover:border-blue-600';

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-center z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 gap-4 md:gap-0">
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm 2xl:text-base font-mono tracking-widest font-bold w-full md:w-auto justify-center md:justify-start overflow-x-auto no-scrollbar py-2 md:py-0">
          <a href="#home" onClick={(e) => handleScrollTo(e, 'home')} className={`transition-colors whitespace-nowrap ${hoverColor}`}>HOME</a>
          <a href="#projects" onClick={(e) => handleScrollTo(e, 'projects')} className={`transition-colors whitespace-nowrap ${hoverColor}`}>PROJECTS</a>
          <a href="#blogs" onClick={(e) => handleScrollTo(e, 'blogs')} className={`transition-colors whitespace-nowrap ${hoverColor}`}>BLOGS</a>
          <a href="#connect" onClick={(e) => handleScrollTo(e, 'connect')} className={`transition-colors whitespace-nowrap ${hoverColor}`}>CONNECT</a>
        </div>
        
        {/* Identity Switcher */}
        <button 
          onClick={handleSwitch}
          className={`border border-slate-700 px-3 md:px-4 py-2 text-[10px] md:text-xs 2xl:text-sm font-mono tracking-widest transition-colors whitespace-nowrap w-full md:w-auto ${hoverColor} ${hoverBorderColor}`}
        >
          {identity === 'engineering' ? 'SWITCH TO DEVELOPER' : 'SWITCH TO ENGINEER'}
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {children}
      </main>

      {createPortal(
        <>
          <ArcadeSidebar />
          <HiddenTerminal />
          <SecretLogin />
        </>,
        document.body
      )}

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
    </div>
  );
};

export default MainLayout;
