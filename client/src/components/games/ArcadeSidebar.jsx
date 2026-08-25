import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../../context/IdentityContext';
import { FaGamepad, FaChevronRight, FaTimes } from 'react-icons/fa';
import Snake from './Snake';
import Tetris from './Tetris';
import CircuitLogic from './CircuitLogic';
import IoTSandbox from './IoTSandbox';

const ArcadeSidebar = () => {
  const { identity } = useIdentity();
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const bgColor = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';
  const hoverColor = identity === 'engineering' ? 'hover:text-orange-500' : 'hover:text-blue-500';
  const borderHover = identity === 'engineering' ? 'hover:border-orange-500' : 'hover:border-blue-500';

  const games = [
    { id: 'snake', name: 'SNAKE', description: 'Classic block-eating reptile.', component: Snake },
    { id: 'tetris', name: 'TETRIS', description: 'Stack the blocks.', component: Tetris },
    { id: 'circuit', name: 'CIRCUIT LOGIC', description: 'Route the power.', component: CircuitLogic },
    { id: 'sandbox', name: 'IOT SANDBOX', description: 'Build and simulate electrical circuits.', component: IoTSandbox },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-zinc-950 border border-l-0 border-slate-200 dark:border-slate-900 p-4 rounded-r-xl ${hoverColor} transition-colors group flex flex-col items-center gap-2`}
      >
        <FaGamepad size={24} className={accentColor} />
        <span className="text-[10px] uppercase font-mono tracking-widest" style={{ writingMode: 'vertical-rl' }}>
          ARCADE
        </span>
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-zinc-50 dark:bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-slate-900 z-50 shadow-2xl flex flex-col font-mono"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-900 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                    DUAL <span className={accentColor}>ARCADE</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Select your game</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-slate-900 dark:text-white transition-colors p-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {games.map(game => (
                  <button
                    key={game.id}
                    onClick={() => game.component && setActiveGame(game.id)}
                    className={`w-full text-left p-4 border border-slate-200 dark:border-slate-900 bg-zinc-50 dark:bg-black transition-all group ${game.component ? borderHover : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`font-bold tracking-widest uppercase ${game.component ? 'text-slate-900 dark:text-white group-hover:' + accentColor.split(' ')[0] : 'text-slate-500'}`}>
                        {game.name}
                      </h3>
                      {game.component && <FaChevronRight className={`text-slate-700 group-hover:${accentColor.split(' ')[0]} transition-colors`} />}
                    </div>
                    <p className="text-xs text-slate-500 tracking-widest">{game.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-zinc-50 dark:bg-black flex items-center justify-center"
          >
            <div className="w-full h-screen">
              {/* Render the selected game */}
              {games.find(g => g.id === activeGame)?.component && React.createElement(games.find(g => g.id === activeGame).component, { onClose: () => setActiveGame(null) })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArcadeSidebar;
