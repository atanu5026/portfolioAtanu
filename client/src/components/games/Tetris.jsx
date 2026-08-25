import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../../context/IdentityContext';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tetromino shapes
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]]  // Z
];

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const Tetris = ({ onClose }) => {
  const { identity } = useIdentity();
  const accentHex = identity === 'engineering' ? '#f97316' : '#3b82f6';
  const accentClass = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const bgClass = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  
  const gameLoopRef = useRef(null);

  const spawnPiece = useCallback(() => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setCurrentPiece(shape);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 });
  }, []);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
    spawnPiece();
  };

  const checkCollision = (piece, pos) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    let gameOverCheck = false;
    
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y;
          if (boardY < 0) {
            gameOverCheck = true;
          } else if (boardY < BOARD_HEIGHT) {
            newBoard[boardY][position.x + x] = 1;
          }
        }
      });
    });

    if (gameOverCheck) {
      setGameOver(true);
      setIsStarted(false);
      return;
    }

    // Clear lines
    let linesCleared = 0;
    const finalBoard = newBoard.filter(row => {
      const isLineFull = row.every(cell => cell === 1);
      if (isLineFull) linesCleared++;
      return !isLineFull;
    });

    while (finalBoard.length < BOARD_HEIGHT) {
      finalBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    if (linesCleared > 0) {
      setScore(s => s + linesCleared * 100);
    }

    setBoard(finalBoard);
    spawnPiece();
  };

  const moveDown = useCallback(() => {
    if (gameOver || !isStarted || !currentPiece) return;
    
    const nextPos = { x: position.x, y: position.y + 1 };
    if (!checkCollision(currentPiece, nextPos)) {
      setPosition(nextPos);
    } else {
      mergePiece();
    }
  }, [currentPiece, position, board, gameOver, isStarted]);

  useEffect(() => {
    if (isStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveDown, 500);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [moveDown, isStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isStarted || gameOver || !currentPiece) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (!checkCollision(currentPiece, { ...position, x: position.x - 1 })) {
            setPosition(p => ({ ...p, x: p.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (!checkCollision(currentPiece, { ...position, x: position.x + 1 })) {
            setPosition(p => ({ ...p, x: p.x + 1 }));
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp': // Rotate
          const rotated = currentPiece[0].map((val, index) => currentPiece.map(row => row[index]).reverse());
          if (!checkCollision(rotated, position)) {
            setCurrentPiece(rotated);
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, position, board, isStarted, gameOver, moveDown]);

  // Render combined board (static board + active piece)
  const renderBoard = board.map(row => [...row]);
  if (currentPiece) {
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value && position.y + y >= 0 && position.y + y < BOARD_HEIGHT) {
          renderBoard[position.y + y][position.x + x] = 2; // 2 represents active piece
        }
      });
    });
  }

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Game Board */}
      <div 
        className="relative border border-slate-900 bg-black shadow-2xl grid gap-[1px]" 
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          width: 'min(100vw, 50vh)',
          height: 'min(200vw, 100vh)'
        }}
      >
        {renderBoard.map((row, y) => (
          row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`w-full h-full ${cell > 0 ? bgClass : 'bg-zinc-900'} ${cell === 2 ? 'opacity-90' : ''}`}
              style={cell > 0 ? { boxShadow: `0 0 10px ${accentHex}` } : {}}
            />
          ))
        ))}
      </div>

      {/* HUD overlays */}
      <div className="absolute top-8 left-8 z-10 space-y-4">
        <div>
          <h2 className={`text-6xl font-bold font-display tracking-widest ${accentClass}`}>TETRIS</h2>
          <p className="text-white text-xl mt-2 uppercase tracking-widest font-bold">SCORE: <span className={accentClass}>{score}</span></p>
        </div>

        {!isStarted && !gameOver && (
          <button 
            onClick={startGame}
            className={`px-8 py-3 bg-black border border-slate-600 text-white hover:bg-slate-800 transition-colors tracking-widest font-bold`}
          >
            START GAME
          </button>
        )}
        
        <div className="hidden md:block text-xs text-slate-500 space-y-1 uppercase tracking-widest mt-8">
          <p>Controls:</p>
          <p>← → : Move</p>
          <p>↑ : Rotate</p>
          <p>↓ : Drop</p>
        </div>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-xs tracking-widest uppercase"
        >
          Close Game
        </button>
      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute inset-0 z-20 ${bgClass} flex flex-col items-center justify-center`}
          >
            <h2 className="text-black text-[8rem] md:text-[20rem] tracking-widest mb-12 uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
              GAME OVER
            </h2>
            <p className="text-xl text-black font-mono mb-8 tracking-widest font-bold">FINAL SCORE: {score}</p>
            <div className="flex gap-6">
              <button 
                onClick={startGame}
                className="bg-black text-white px-8 py-4 font-bold tracking-widest text-sm uppercase hover:bg-zinc-900 transition-colors"
              >
                RESTART
              </button>
              <button 
                onClick={onClose}
                className="border-2 border-black text-black px-8 py-4 font-bold tracking-widest text-sm uppercase hover:bg-black/10 transition-colors"
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

export default Tetris;
