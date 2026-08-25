import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../../context/IdentityContext';

const GRID_SIZE = 5;

// Tile types:
// 0: Empty
// 1: Straight (│)
// 2: Corner (└)
// 3: Source (Starts power)
// 4: Destination (Ends power)
const LEVELS = [
  // Level 1: Simple straight line with one corner
  [
    [{ type: 3, rotation: 1, fixed: true }, { type: 1, rotation: 0 }, { type: 2, rotation: 1 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 1, rotation: 1 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 0, rotation: 0 }, { type: 2, rotation: 0 }, { type: 2, rotation: 2 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 0, rotation: 0 }, { type: 1, rotation: 1 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 0, rotation: 0 }, { type: 2, rotation: 3 }, { type: 1, rotation: 0 }, { type: 1, rotation: 0 }, { type: 4, rotation: 3, fixed: true }],
  ],
  // Level 2: More corners and winding path
  [
    [{ type: 0, rotation: 0 }, { type: 3, rotation: 2, fixed: true }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 2, rotation: 1 }, { type: 2, rotation: 3 }, { type: 0, rotation: 0 }, { type: 2, rotation: 1 }, { type: 2, rotation: 2 }],
    [{ type: 1, rotation: 1 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 1, rotation: 1 }, { type: 0, rotation: 0 }],
    [{ type: 2, rotation: 0 }, { type: 1, rotation: 0 }, { type: 2, rotation: 1 }, { type: 2, rotation: 3 }, { type: 0, rotation: 0 }],
    [{ type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 4, rotation: 0, fixed: true }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
  ],
  // Level 3: Complex loop options
  [
    [{ type: 3, rotation: 1, fixed: true }, { type: 2, rotation: 1 }, { type: 2, rotation: 2 }, { type: 0, rotation: 0 }, { type: 4, rotation: 2, fixed: true }],
    [{ type: 0, rotation: 0 }, { type: 1, rotation: 1 }, { type: 1, rotation: 1 }, { type: 0, rotation: 0 }, { type: 1, rotation: 1 }],
    [{ type: 2, rotation: 1 }, { type: 2, rotation: 3 }, { type: 2, rotation: 0 }, { type: 1, rotation: 0 }, { type: 2, rotation: 3 }],
    [{ type: 1, rotation: 1 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }, { type: 0, rotation: 0 }],
    [{ type: 2, rotation: 0 }, { type: 1, rotation: 0 }, { type: 1, rotation: 0 }, { type: 1, rotation: 0 }, { type: 2, rotation: 3 }],
  ]
];

// Returns valid exit directions (0: Top, 1: Right, 2: Bottom, 3: Left) based on rotation
const getExits = (type, rotation) => {
  if (type === 0) return [];
  if (type === 1) return rotation % 2 === 0 ? [0, 2] : [1, 3];
  if (type === 2) {
    if (rotation === 0) return [0, 1]; // Top, Right
    if (rotation === 1) return [1, 2]; // Right, Bottom
    if (rotation === 2) return [2, 3]; // Bottom, Left
    if (rotation === 3) return [3, 0]; // Left, Top
  }
  if (type === 3) return [rotation]; // Source outputs in 1 direction
  if (type === 4) return [rotation]; // Dest accepts from 1 direction
  return [];
};

const CircuitLogic = ({ onClose }) => {
  const { identity } = useIdentity();
  const accentHex = identity === 'engineering' ? '#f97316' : '#3b82f6';
  const accentClass = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';

  const [levelIndex, setLevelIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [powered, setPowered] = useState([]);
  const [isWin, setIsWin] = useState(false);

  // Initialize or change level
  useEffect(() => {
    const currentLevel = JSON.parse(JSON.stringify(LEVELS[levelIndex]));
    const scrambled = currentLevel.map(row => 
      row.map(cell => cell.fixed ? cell : { ...cell, rotation: Math.floor(Math.random() * 4) })
    );
    setGrid(scrambled);
    setPowered(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(false)));
    setIsWin(false);
  }, [levelIndex]);

  const calculatePower = (currentGrid) => {
    if (currentGrid.length === 0) return;
    
    const newPowered = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(false));
    let startX = 0, startY = 0;

    // Find source
    for(let y=0; y<GRID_SIZE; y++) {
      for(let x=0; x<GRID_SIZE; x++) {
        if(currentGrid[y][x].type === 3) { startX = x; startY = y; }
      }
    }

    const queue = [{ x: startX, y: startY }];
    newPowered[startY][startX] = true;
    let reachedDest = false;

    while(queue.length > 0) {
      const curr = queue.shift();
      const cell = currentGrid[curr.y][curr.x];
      const exits = getExits(cell.type, cell.rotation);

      if (cell.type === 4) {
        reachedDest = true;
      }

      exits.forEach(dir => {
        let nx = curr.x, ny = curr.y;
        let requiredEntry = -1;
        if(dir === 0) { ny--; requiredEntry = 2; }
        if(dir === 1) { nx++; requiredEntry = 3; }
        if(dir === 2) { ny++; requiredEntry = 0; }
        if(dir === 3) { nx--; requiredEntry = 1; }

        if(nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !newPowered[ny][nx]) {
          const neighbor = currentGrid[ny][nx];
          const neighborExits = getExits(neighbor.type, neighbor.rotation);
          if (neighborExits.includes(requiredEntry)) {
            newPowered[ny][nx] = true;
            queue.push({ x: nx, y: ny });
          }
        }
      });
    }

    setPowered(newPowered);
    if(reachedDest) {
      setTimeout(() => setIsWin(true), 500);
    }
  };

  useEffect(() => {
    calculatePower(grid);
    // eslint-disable-next-line
  }, [grid]);

  const rotateCell = (x, y) => {
    if (isWin || grid[y][x].fixed || grid[y][x].type === 0) return;
    
    const newGrid = [...grid];
    newGrid[y][x] = { ...newGrid[y][x], rotation: (newGrid[y][x].rotation + 1) % 4 };
    setGrid(newGrid);
  };

  const renderTile = (cell, isPowered) => {
    const color = isPowered ? accentHex : '#334155';
    const glow = isPowered ? `0 0 10px ${accentHex}` : 'none';

    if (cell.type === 0) return null;

    if (cell.type === 3) return <div className="w-4 h-4 bg-white rounded-sm shadow-[0_0_15px_white]" />;
    if (cell.type === 4) return <div className={`w-6 h-6 border-2 border-slate-500 rounded-sm flex items-center justify-center ${isPowered ? 'bg-'+accentClass.split('-')[1]+'-500' : ''}`} style={{boxShadow: glow}}/>;

    // Straight
    if (cell.type === 1) {
      return <div className="w-2 h-full bg-slate-500 transition-colors duration-300" style={{ backgroundColor: color, boxShadow: glow }} />;
    }
    // Corner
    if (cell.type === 2) {
      return (
        <div className="relative w-full h-full flex justify-center">
          <div className="absolute top-0 w-2 h-1/2 bg-slate-500 transition-colors duration-300" style={{ backgroundColor: color, boxShadow: glow }} />
          <div className="absolute right-0 top-[calc(50%-4px)] w-1/2 h-2 bg-slate-500 transition-colors duration-300" style={{ backgroundColor: color, boxShadow: glow }} />
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950 font-mono">
      <div className="absolute top-8 right-8">
        <button 
          onClick={onClose}
          className="text-slate-900 dark:text-white hover:text-red-500 transition-colors border border-slate-300 dark:border-slate-800 p-2"
        >
          CLOSE [ESC]
        </button>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="text-center">
          <h2 className={`text-4xl font-bold font-display tracking-widest ${accentClass}`}>CIRCUIT LOGIC</h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Route power to the destination</p>
        </div>

        {/* Game Board */}
        <div 
          className="bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-800 p-4 grid gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {grid.map((row, y) => (
            row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                onClick={() => rotateCell(x, y)}
                className={`w-16 h-16 bg-zinc-100 dark:bg-zinc-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-all ${cell.fixed ? 'opacity-50' : ''}`}
                style={{ transform: `rotate(${cell.rotation * 90}deg)` }}
              >
                {renderTile(cell, powered[y][x])}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Win Screen */}
      <AnimatePresence>
        {isWin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-black/90 backdrop-blur-md"
          >
            <h1 className={`text-9xl font-display ${accentClass} mb-8`} style={{ textShadow: `0 0 30px ${accentHex}` }}>
              SYSTEM ONLINE
            </h1>
            <p className="text-xl text-slate-900 dark:text-white font-mono mb-8 tracking-widest">POWER ROUTED SUCCESSFULLY</p>
            <div className="flex gap-4">
              {levelIndex < LEVELS.length - 1 ? (
                <button 
                  onClick={() => setLevelIndex(i => i + 1)}
                  className="px-8 py-3 border border-slate-600 text-slate-900 dark:text-white font-mono hover:bg-slate-800 transition-colors"
                >
                  NEXT LEVEL
                </button>
              ) : (
                <div className="text-green-500 font-mono font-bold tracking-widest mr-4 flex items-center">
                  ALL CIRCUITS RESTORED
                </div>
              )}
              <button 
                onClick={onClose}
                className="px-8 py-3 border border-slate-600 text-slate-900 dark:text-white font-mono hover:bg-slate-800 transition-colors"
              >
                EXIT TO ARCADE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CircuitLogic;
