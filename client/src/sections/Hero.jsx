import React from 'react';
import { motion } from 'framer-motion';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';
import Loader from '../components/Loader';
import InteractiveHero3D from '../components/InteractiveHero3D';

const Hero = () => {
  const { identity } = useIdentity();
  const { profileData, loading } = useProfile();
  
  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';

  if (loading || !profileData) return <Loader />;

  const profile = identity === 'engineering' ? profileData.engineering : profileData.developer;

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden scroll-mt-32">
      {/* 3D Background */}
      <InteractiveHero3D />

      {/* Dynamic Background Elements */}
      <div className={`absolute top-1/4 -right-64 w-96 h-96 bg-current opacity-5 blur-[128px] rounded-full ${accentColor}`}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-12 z-10 mb-[20vh] md:mb-0 md:-mt-32 relative"
      >
        <p className="font-mono text-sm tracking-[0.3em] text-slate-500 mb-4 md:mb-6 uppercase">
          Hello, I am
        </p>
        <h1 className="text-5xl md:text-8xl font-black mb-4 uppercase tracking-tighter leading-none md:leading-normal">
          {profileData.name.split(' ')[0]} <span className="text-slate-900 dark:text-white/40 block md:inline">{profileData.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        
        <h2 className={`text-2xl md:text-4xl font-bold mb-6 md:mb-8 uppercase tracking-widest flex items-center gap-4 ${accentColor}`}>
          <span className={`w-8 md:w-12 h-1 bg-current`}></span>
          {profile.heroTitle}
        </h2>

        <p className="max-w-xl md:max-w-2xl text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 md:mb-12">
          {profile.heroDescription}
        </p>

          <div className="flex flex-col md:flex-row gap-4">
            <a 
              href="#projects"
              className={`border border-current px-6 md:px-8 py-3 text-sm font-bold tracking-widest uppercase transition-colors text-center w-full md:w-auto ${accentColor} hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-black dark:hover:border-white`}
            >
              View Projects
            </a>
            <a 
              href="#connect"
              className="border border-slate-300 dark:border-slate-700 px-6 md:px-8 py-3 text-sm font-bold tracking-widest uppercase text-center w-full md:w-auto text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:border-slate-900 dark:hover:text-white dark:hover:border-white transition-colors"
            >
              Contact Me
            </a>
            <a 
              href={profileData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={`border border-current px-6 md:px-8 py-3 text-sm font-bold tracking-widest uppercase transition-colors text-center w-full md:w-auto ${accentColor} hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-black dark:hover:border-white`}
            >
              Download Resume
            </a>
          </div>
      </motion.div>
    </section>
  );
};

export default Hero;
