import React, { useState } from 'react';
import { useThemeEra } from '../context/ThemeEraContext';
import { motion, AnimatePresence } from 'framer-motion';

const TimeMachineWidget = () => {
  const { era, setEra } = useThemeEra();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-[999] font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 p-4 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
          >
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2">Time Machine</h4>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setEra('retro-90s'); setIsOpen(false); }}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase text-left transition-colors border-2 border-transparent hover:border-black dark:hover:border-white ${era === 'retro-90s' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-slate-900 dark:text-white'}`}
              >
                1999 (Web 1.0)
              </button>
              <button 
                onClick={() => { setEra('y2k'); setIsOpen(false); }}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase text-left transition-colors border-2 border-transparent hover:border-black dark:hover:border-white ${era === 'y2k' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-slate-900 dark:text-white'}`}
              >
                2005 (Frutiger Aero)
              </button>
              <button 
                onClick={() => { setEra('modern'); setIsOpen(false); }}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase text-left transition-colors border-2 border-transparent hover:border-black dark:hover:border-white ${era === 'modern' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-slate-900 dark:text-white'}`}
              >
                2026 (Modern)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-900 dark:text-white flex items-center justify-center font-bold text-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
        title="Time Machine"
      >
        ⌛
      </button>
    </div>
  );
};

export default TimeMachineWidget;
