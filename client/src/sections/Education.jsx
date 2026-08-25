import React from 'react';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';

const Education = () => {
  const { identity } = useIdentity();
  const { profileData, loading } = useProfile();
  
  if (loading || !profileData) return null;

  const isEngineer = identity === 'engineering';
  const accentColor = isEngineer ? 'text-orange-500' : 'text-blue-500';
  const borderColor = isEngineer ? 'border-orange-500' : 'border-blue-500';

  const profile = isEngineer ? profileData.engineering : profileData.developer;
  const educationData = profile.education || [];

  return (
    <section className={`min-h-[50vh] border-l-2 md:border-l-4 ${borderColor} pl-4 md:pl-8`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-8 md:mb-12 uppercase tracking-widest ${accentColor}`}>Education</h2>
      
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {educationData.map((item, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-none border-2 border-slate-200 dark:border-slate-900 bg-zinc-50 dark:bg-black ${accentColor} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
              <div className={`w-1.5 md:w-2 h-1.5 md:h-2 ${isEngineer ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            </div>
            
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-6 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 shadow-xl group-hover:border-slate-300 dark:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-[10px] md:text-xs font-bold tracking-widest ${accentColor}`}>{item.year}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg uppercase tracking-widest mb-1">{item.institution}</h3>
              <p className="font-mono text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2 md:mb-4">{item.degree}</p>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
