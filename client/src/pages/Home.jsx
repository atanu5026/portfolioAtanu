import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
    }, 400);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Atanu Ghosh | Engineer & Developer Portfolio</title>
        <meta name="description" content="Welcome to the interactive portfolio of Atanu Ghosh. Choose between my Electrical Engineering or Full Stack Developer identities." />
        <link rel="canonical" href="https://www.buildwithatanu.in/" />
      </Helmet>
      <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-zinc-50 dark:bg-black font-mono relative">
        {/* Engineering Side */}
        <Link
          to="/portfolio"
          className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            handleSelect(e, 'engineering');
          }}
        >
          {/* Hover Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />

          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase transition-colors duration-500">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors duration-500 uppercase tracking-widest">
              Electrical<br />Engineer
            </h1>
          </div>
        </Link>

        {/* Developer Side */}
        <Link
          to="/portfolio"
          className="flex-1 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            handleSelect(e, 'developer');
          }}
        >
          {/* Hover Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-transparent -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />

          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase transition-colors duration-500">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors duration-500 uppercase tracking-widest">
              Full Stack<br />Developer
            </h1>
          </div>
        </Link>
      </div>

      <AnimatePresence>
        {transitionState.active && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${transitionState.x}px ${transitionState.y}px)` }}
            animate={{ clipPath: `circle(3000px at ${transitionState.x}px ${transitionState.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 pointer-events-none ${transitionState.targetIdentity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500'}`}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Home;
