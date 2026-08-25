import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useIdentity } from '../context/IdentityContext';

const Experience = () => {
  const { identity } = useIdentity();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';
  const bgAccent = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get('/api/experience');
        // Filter by identity (engineering, developer, or both)
        const filtered = res.data.filter(exp => 
          exp.category === identity || exp.category === 'both'
        );
        setExperiences(filtered);
      } catch (err) {
        console.error('Failed to load experiences', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [identity]);

  if (loading) return null; // Or a subtle loader

  return (
    <section className={`border-l-2 md:border-l-4 ${borderColor} pl-4 md:pl-8 py-8 md:py-12`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-8 md:mb-16 uppercase tracking-widest ${accentColor}`}>Experience Timeline</h2>
      
      <div className="relative border-l border-slate-300 dark:border-slate-800 ml-2 md:ml-8 space-y-12 md:space-y-16 pb-8">
        {experiences.length === 0 ? (
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No experience listed for this identity.</p>
        ) : (
          experiences.map((exp, index) => (
            <motion.div 
              key={exp._id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-6 md:pl-12"
            >
              {/* Timeline Dot */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 + 0.2 }}
                className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${bgAccent} shadow-[0_0_10px_currentColor]`}
              />
              
              <div className="group flex flex-col items-start">
                <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-slate-500 mb-2 border border-slate-300 dark:border-slate-800 px-3 py-1 bg-zinc-50 dark:bg-black">
                  {exp.year}
                </span>
                <h3 className={`text-lg md:text-2xl font-bold text-slate-900 dark:text-white group-hover:${accentColor.split(' ')[0]} transition-colors uppercase tracking-widest mb-1`}>
                  {exp.title}
                </h3>
                <h4 className="text-xs md:text-sm font-mono text-slate-500 dark:text-slate-400 mb-4">{exp.company}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-sm md:text-base whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default Experience;
