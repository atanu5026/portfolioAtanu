import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../../context/IdentityContext';
import { FaBatteryFull, FaLightbulb, FaArrowsAltH, FaArrowRight, FaToggleOn, FaEraser, FaFan, FaPlus, FaWaveSquare } from 'react-icons/fa';

const COLS = 15;
const ROWS = 10;

// Component Types
const EMPTY = 0;
const WIRE_STRAIGHT = 1;
const WIRE_CORNER = 2;
const WIRE_CROSS = 6;
const BATTERY = 3;
const BULB = 4;
const SWITCH = 5;
const RESISTOR = 7;
const MOTOR = 8;

// Toolbar definition
const TOOLS = [
  { id: BATTERY, name: 'BATTERY', icon: FaBatteryFull },
  { id: BULB, name: 'BULB', icon: FaLightbulb },
  { id: MOTOR, name: 'MOTOR', icon: FaFan },
  { id: WIRE_STRAIGHT, name: 'WIRE (STRAIGHT)', icon: FaArrowsAltH },
  { id: WIRE_CORNER, name: 'WIRE (CORNER)', icon: FaArrowRight },
  { id: WIRE_CROSS, name: 'WIRE (CROSS)', icon: FaPlus },
  { id: SWITCH, name: 'SWITCH', icon: FaToggleOn },
  { id: RESISTOR, name: 'RESISTOR', icon: FaWaveSquare },
  { id: EMPTY, name: 'ERASER', icon: FaEraser },
];

const IoTSandbox = ({ onClose }) => {
  const { identity } = useIdentity();
  const accentHex = identity === 'engineering' ? '#f97316' : '#3b82f6';
  const accentClass = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const bgClass = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';

  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => 
      Array.from({ length: COLS }, () => ({ type: EMPTY, rotation: 0, state: false }))
    )
  );
  
  const [powered, setPowered] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  );

  const [activeTool, setActiveTool] = useState(WIRE_STRAIGHT);

  // Valid exits based on rotation
  const getExits = (cell) => {
    if (cell.type === EMPTY) return [];
    if (cell.type === BATTERY) return [0]; // Outputs top
    if (cell.type === BULB || cell.type === MOTOR) return [2]; // Inputs bottom
    
    // Switch (acts like straight wire, but only if state is true/closed)
    if (cell.type === SWITCH) {
      if (!cell.state) return []; // Open circuit
      return cell.rotation % 2 === 0 ? [1, 3] : [0, 2]; // Horizontal or Vertical
    }

    if (cell.type === WIRE_STRAIGHT || cell.type === RESISTOR) return cell.rotation % 2 === 0 ? [1, 3] : [0, 2];
    
    if (cell.type === WIRE_CROSS) return [0, 1, 2, 3]; // 4-way connection
    
    if (cell.type === WIRE_CORNER) {
      if (cell.rotation === 0) return [0, 1]; // Top, Right
      if (cell.rotation === 1) return [1, 2]; // Right, Bottom
      if (cell.rotation === 2) return [2, 3]; // Bottom, Left
      if (cell.rotation === 3) return [3, 0]; // Left, Top
    }
    return [];
  };

  // Run simulation on grid change
  useEffect(() => {
    const newPowered = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const queue = [];

    // Find all batteries (power sources)
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x].type === BATTERY) {
          queue.push({ x, y });
          newPowered[y][x] = true;
        }
      }
    }

    // BFS for power propagation
    while (queue.length > 0) {
      const curr = queue.shift();
      const cell = grid[curr.y][curr.x];
      const exits = getExits(cell);

      exits.forEach(dir => {
        let nx = curr.x, ny = curr.y;
        let requiredEntry = -1;
        if (dir === 0) { ny--; requiredEntry = 2; }
        if (dir === 1) { nx++; requiredEntry = 3; }
        if (dir === 2) { ny++; requiredEntry = 0; }
        if (dir === 3) { nx--; requiredEntry = 1; }

        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !newPowered[ny][nx]) {
          const neighbor = grid[ny][nx];
          const neighborExits = getExits(neighbor);
          if (neighborExits.includes(requiredEntry) || ((neighbor.type === BULB || neighbor.type === MOTOR) && requiredEntry === 2)) {
            newPowered[ny][nx] = true;
            queue.push({ x: nx, y: ny });
          }
        }
      });
    }

    setPowered(newPowered);
  }, [grid]);

  const handleCellClick = (x, y) => {
    const newGrid = [...grid];
    const cell = newGrid[y][x];

    // Toggle switch state if clicking an existing switch
    if (activeTool === SWITCH && cell.type === SWITCH) {
      newGrid[y][x] = { ...cell, state: !cell.state };
      setGrid(newGrid);
      return;
    }

    // Rotate component if clicking the same tool again
    if (cell.type === activeTool && cell.type !== EMPTY) {
      newGrid[y][x] = { ...cell, rotation: (cell.rotation + 1) % 4 };
    } else {
      // Place new component
      newGrid[y][x] = { type: activeTool, rotation: 0, state: false };
    }
    
    setGrid(newGrid);
  };

  const renderComponent = (cell, isPowered) => {
    const powerColor = isPowered ? accentHex : '#475569';
    const glow = isPowered ? `0 0 10px ${accentHex}` : 'none';

    switch (cell.type) {
      case BATTERY:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            <div className="w-1 h-2 bg-slate-400 absolute top-0" />
            <div className="w-6 h-4 border-2 border-slate-400 flex items-center justify-center text-[8px] text-slate-400">12V</div>
          </div>
        );
      case BULB:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            <div className="w-4 h-4 rounded-full border-2 transition-all duration-300" style={{ borderColor: powerColor, backgroundColor: isPowered ? powerColor : 'transparent', boxShadow: glow }} />
            <div className="w-1 h-3 transition-colors duration-300" style={{ backgroundColor: powerColor }} />
          </div>
        );
      case WIRE_STRAIGHT:
        return (
          <div className="w-full h-1 absolute top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ backgroundColor: powerColor, boxShadow: glow }} />
        );
      case WIRE_CORNER:
        return (
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 transition-colors duration-300" style={{ backgroundColor: powerColor, boxShadow: glow }} />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/2 h-1 transition-colors duration-300" style={{ backgroundColor: powerColor, boxShadow: glow }} />
          </div>
        );
      case WIRE_CROSS:
        return (
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full transition-colors duration-300" style={{ backgroundColor: powerColor, boxShadow: glow }} />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 transition-colors duration-300" style={{ backgroundColor: powerColor, boxShadow: glow }} />
          </div>
        );
      case RESISTOR:
        return (
          <div className="flex items-center justify-center w-full h-full transition-colors duration-300" style={{ color: powerColor, filter: isPowered ? `drop-shadow(0 0 5px ${accentHex})` : 'none' }}>
            <FaWaveSquare size={24} />
          </div>
        );
      case MOTOR:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            <motion.div 
              animate={{ rotate: isPowered ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-300 bg-zinc-900 z-10" 
              style={{ borderColor: powerColor, color: powerColor, boxShadow: glow }}
            >
              M
            </motion.div>
            <div className="absolute bottom-0 w-1 h-1/2 transition-colors duration-300" style={{ backgroundColor: powerColor }} />
          </div>
        );
      case SWITCH:
        return (
          <div className="w-full h-full relative flex items-center justify-center group">
            {/* Base Wire */}
            <div className="absolute left-0 w-3 h-1" style={{ backgroundColor: powerColor }} />
            <div className="absolute right-0 w-3 h-1" style={{ backgroundColor: powerColor }} />
            {/* The Switch Gate */}
            <div 
              className="w-8 h-1 origin-left transition-transform duration-300" 
              style={{ backgroundColor: powerColor, transform: cell.state ? 'rotate(0deg) translateX(-10px)' : 'rotate(-30deg) translateX(-10px)', boxShadow: glow }} 
            />
            {/* Click hint */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 rounded-sm pointer-events-none" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 font-mono">
      <div className="absolute top-8 right-8">
        <button 
          onClick={onClose}
          className="text-white hover:text-red-500 transition-colors border border-slate-800 p-2"
        >
          CLOSE [ESC]
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold font-display tracking-widest ${accentClass}`}>IoT SANDBOX</h2>
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Build and simulate electrical circuits</p>
      </div>

      {/* Grid Canvas */}
      <div 
        className="bg-black border border-slate-800 grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {grid.map((row, y) => (
          row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              onClick={() => handleCellClick(x, y)}
              className="w-12 h-12 border border-slate-900/50 hover:bg-zinc-900 transition-colors cursor-crosshair flex items-center justify-center relative"
              style={{ transform: `rotate(${cell.rotation * 90}deg)` }}
            >
              {renderComponent(cell, powered[y][x])}
            </div>
          ))
        ))}
      </div>

      {/* Bottom Inventory Toolbar */}
      <div className="fixed bottom-8 flex gap-4 bg-black border border-slate-800 p-4 rounded-xl shadow-2xl">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex flex-col items-center justify-center w-24 h-20 border rounded-lg transition-colors ${isActive ? 'bg-slate-900 ' + accentClass + ' ' + (identity === 'engineering' ? 'border-orange-500' : 'border-blue-500') : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600'}`}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-[10px] tracking-widest">{tool.name}</span>
            </button>
          )
        })}
      </div>
      
      {/* Tool Tip */}
      <div className="absolute bottom-32 text-slate-500 text-xs tracking-widest uppercase">
        Tip: Click a placed component again to rotate it. Click a Switch to toggle it on/off.
      </div>
    </div>
  );
};

export default IoTSandbox;
