import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../context/IdentityContext';
import PageTransition from '../components/PageTransition';

const Home = () => {
  const navigate = useNavigate();
  const { setIdentity } = useIdentity();
  
  const handleSelect = (identity) => {
    setIdentity(identity);
    navigate('/portfolio');
  };

  return (
    <PageTransition>
      <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-black font-mono relative">
        {/* Engineering Side */}
        <div 
          className="flex-1 border-b md:border-b-0 md:border-r border-slate-900 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={() => handleSelect('engineering')}
        >
          <div className="absolute inset-0 bg-orange-950/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out z-0"></div>
          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-white group-hover:text-orange-500 transition-colors uppercase tracking-widest">
              Electrical<br />Engineer
            </h1>
          </div>
        </div>

        {/* Developer Side */}
        <div 
          className="flex-1 flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={() => handleSelect('developer')}
        >
          <div className="absolute inset-0 bg-blue-950/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out z-0"></div>
          <div className="z-10 text-center relative pointer-events-none">
            <p className="text-xs text-slate-500 tracking-[0.3em] mb-4 uppercase">Choose This Side</p>
            <h1 className="text-4xl md:text-5xl font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-widest">
              Full Stack<br />Developer
            </h1>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
