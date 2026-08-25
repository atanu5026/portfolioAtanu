import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';
import ThemePicker from '../components/games/ThemePicker';

const Footer = () => {
  const { identity } = useIdentity();
  const { profileData } = useProfile();
  const [logs, setLogs] = useState([]);
  
  const accentColor = identity === 'engineering' ? 'from-orange-500/20' : 'from-blue-500/20';
  const textColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const bgAccent = identity === 'engineering' ? 'bg-orange-500/10 text-orange-500 border-orange-500' : 'bg-blue-500/10 text-blue-500 border-blue-500';

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/guestbook');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <footer className="w-full relative mt-32">
      {/* Live Server Log Marquee */}
      <div className="w-full bg-white dark:bg-zinc-950 border-t border-b border-slate-200 dark:border-slate-900 py-3 overflow-hidden flex items-center relative z-10">
        <div className={`absolute left-0 top-0 bottom-0 px-4 flex items-center z-20 bg-white dark:bg-zinc-950 border-r ${bgAccent} font-mono text-xs tracking-widest font-bold uppercase`}>
          Live Server Log
        </div>
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] ml-40">
          {logs.length > 0 ? logs.map((log, i) => (
            <span key={i} className="mx-8 font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className={textColor}>{'>'}</span> 
              <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-slate-600 dark:text-slate-300">"{log.message}"</span>
            </span>
          )) : (
            <span className="mx-8 font-mono text-xs text-slate-500 uppercase tracking-widest">Awaiting connections... Type 'sign-guestbook "Message"' in the terminal.</span>
          )}
          {/* Duplicate for seamless loop if there are logs */}
          {logs.length > 0 && logs.map((log, i) => (
            <span key={`dup-${i}`} className="mx-8 font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className={textColor}>{'>'}</span> 
              <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-slate-600 dark:text-slate-300">"{log.message}"</span>
            </span>
          ))}
        </div>
      </div>

      <div className={`absolute inset-0 top-12 bg-gradient-to-t ${accentColor} to-black pointer-events-none opacity-50`}></div>
      <div className="relative bg-zinc-50 dark:bg-black pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-2">
              {profileData?.name?.split(' ')[0] || 'ATANU'} <span className={textColor}>{profileData?.name?.split(' ').slice(1).join(' ') || 'GHOSH'}</span>
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 font-mono tracking-widest">ENGINEERING & DEVELOPMENT PORTFOLIO</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-mono tracking-widest font-bold">
            <a href={profileData?.socialLinks?.github || '#'} target="_blank" rel="noreferrer" className={`hover:${textColor} transition-colors text-slate-500 dark:text-slate-400`}>GITHUB</a>
            <a href={profileData?.socialLinks?.linkedin || '#'} target="_blank" rel="noreferrer" className={`hover:${textColor} transition-colors text-slate-500 dark:text-slate-400`}>LINKEDIN</a>
            <a href={profileData?.socialLinks?.email ? `mailto:${profileData.socialLinks.email}` : '#connect'} className={`hover:${textColor} transition-colors text-slate-500 dark:text-slate-400`}>EMAIL</a>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-12 mt-12 flex justify-center border-t border-slate-200 dark:border-slate-900 pt-8">
          <ThemePicker />
        </div>
        
        <div className="container mx-auto px-4 md:px-12 mt-12 text-center">
          <p className="text-[10px] md:text-xs text-slate-600 font-mono tracking-widest">
            &copy; {new Date().getFullYear()} ATANU GHOSH. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
