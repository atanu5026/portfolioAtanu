import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../../context/IdentityContext';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

const Snake = ({ onClose }) => {
  const { identity } = useIdentity();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isDead, setIsDead] = useState(false);
  const [score, setScore] = useState(0);

  const accentClass = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';
  const accentText = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsDead(false);
    setFood(generateFood());
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isDead) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsDead(true);
          return prev;
        }

        // Check self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsDead(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, generateFood, isDead]);

  return (
    <div className="relative w-full h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden font-mono">
      <div 
        className="relative border border-slate-200 dark:border-slate-900 bg-zinc-50 dark:bg-black shadow-2xl"
        style={{
          width: 'min(100vw, 100vh)',
          height: 'min(100vw, 100vh)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, idx) => (
          <div
            key={`${segment.x}-${segment.y}-${idx}`}
            className={`${accentClass} ${idx === 0 ? 'rounded-sm' : ''}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              margin: '2px' // Slight gap between segments
            }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`${accentClass} rounded-full`}
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '8px' // Make food smaller
          }}
        />
      </div>

      <div className="absolute top-8 left-8 z-10 text-slate-900 dark:text-white text-xl tracking-widest font-bold">
        SCORE: <span className={accentText}>{score}</span>
      </div>
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-10 text-slate-500 hover:text-slate-900 dark:text-white transition-colors text-xs tracking-widest uppercase"
      >
        Close Game
      </button>

      {/* Mobile Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 md:hidden">
        <button 
          onClick={() => { if (direction.y === 0) setDirection({ x: 0, y: -1 }) }}
          className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-700 text-slate-900 dark:text-white"
        >
          ▲
        </button>
        <div className="flex gap-8">
          <button 
            onClick={() => { if (direction.x === 0) setDirection({ x: -1, y: 0 }) }}
            className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-700 text-slate-900 dark:text-white"
          >
            ◀
          </button>
          <button 
            onClick={() => { if (direction.x === 0) setDirection({ x: 1, y: 0 }) }}
            className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-700 text-slate-900 dark:text-white"
          >
            ▶
          </button>
        </div>
        <button 
          onClick={() => { if (direction.y === 0) setDirection({ x: 0, y: 1 }) }}
          className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center active:bg-slate-300 dark:active:bg-slate-700 text-slate-900 dark:text-white"
        >
          ▼
        </button>
      </div>

      <AnimatePresence>
        {isDead && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute inset-0 z-20 ${accentClass} flex flex-col items-center justify-center`}
          >
            <h2 className="text-black text-[8rem] md:text-[20rem] tracking-widest mb-12 uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>DEAD</h2>
            <div className="flex gap-6">
              <button 
                onClick={resetGame}
                className="bg-zinc-50 dark:bg-black text-slate-900 dark:text-white px-8 py-4 font-bold tracking-widest text-sm uppercase hover:bg-zinc-100 dark:bg-zinc-900 transition-colors"
              >
                Restart
              </button>
              <button 
                onClick={onClose}
                className="border-2 border-black text-black px-8 py-4 font-bold tracking-widest text-sm uppercase hover:bg-zinc-50 dark:bg-black/10 transition-colors"
              >
                Go to Portfolio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Snake;
