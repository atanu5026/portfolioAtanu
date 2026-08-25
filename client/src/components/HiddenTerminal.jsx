import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../context/IdentityContext';
import { FaTerminal, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ThemePicker from './games/ThemePicker';

const HiddenTerminal = () => {
  const { identity } = useIdentity();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'system', text: 'AGY OS v1.0.4 - Initialization complete.' },
    { type: 'system', text: 'Type "help" for a list of commands.' }
  ]);
  
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const keyBuffer = useRef('');

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const accentBorder = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';

  // Listen for the secret code "atanu"
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't capture keys if terminal is already open
      if (isOpen) return;
      
      // Ignore modifier keys
      if (e.key.length !== 1) return;

      keyBuffer.current += e.key.toLowerCase();
      if (keyBuffer.current.length > 5) {
        keyBuffer.current = keyBuffer.current.slice(-5);
      }

      if (keyBuffer.current === 'atanu') {
        setIsOpen(true);
        keyBuffer.current = '';
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Focus input when opened and scroll to bottom on new output
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setInput('');
      
      // Add user command to output
      setOutput(prev => [...prev, { type: 'user', text: `$ ${cmd}` }]);

      if (!cmd) return;

      // Command processing
      let response = [];
      
      // Handle sign-guestbook "message"
      if (cmd.startsWith('sign-guestbook ')) {
        const msgMatch = cmd.match(/sign-guestbook\s+"([^"]+)"/);
        if (msgMatch && msgMatch[1]) {
          const message = msgMatch[1];
          try {
            await axios.post('/api/guestbook', {
              message,
              signature: 'AGY Terminal User'
            });
            response = [
              'Connecting to backend server...',
              'Encrypting message...',
              'SUCCESS: Entry added to the global Guestbook.'
            ];
          } catch (err) {
            response = ['ERROR: Failed to connect to Guestbook API.'];
          }
        } else {
          response = ['ERROR: Invalid syntax. Use: sign-guestbook "Your Message Here"'];
        }
      } else {
        switch (cmd) {
          case 'help':
            response = [
              'Available commands:',
              '  whoami          - Display current user info',
              '  projects        - List secure data modules',
              '  identity        - Show current identity configuration',
              '  clear           - Clear terminal output',
              '  sign-guestbook  - Leave a message (e.g. sign-guestbook "Hello")',
              '  sudo            - Elevate privileges',
              '  exit            - Close terminal connection'
            ];
            break;
          case 'whoami':
            response = ['guest@portfolio ~ (Visitor)'];
            break;
          case 'projects':
            response = ['Fetching database...', 'ERROR: Access denied. Requires authorization.'];
            break;
          case 'identity':
            response = [`Current mode: ${identity.toUpperCase()}`, `Accent HEX mapping active.`];
            break;
          case 'sudo':
            response = ['This incident will be reported.'];
            break;
          case 'sudo hire atanu':
            response = [
              '========================================',
              '>>> EXECUTING HIRE DIRECTIVE <<<',
              '========================================',
              'Processing candidate [Atanu Ghosh]...',
              'Skills verified: FULL-STACK, 3D, IOT, AI',
              'Offer letter generated and encrypted.',
              'Sending to atanu.ghosh@example.com...',
              'SUCCESS: Candidate hired successfully.',
              '========================================'
            ];
            break;
          case 'clear':
            setOutput([]);
            return;
          case 'exit':
            setIsOpen(false);
            return;
          default:
            response = [`command not found: ${cmd}`];
            break;
        }
      }

      // Add response to output
      setTimeout(() => {
        setOutput(prev => [
          ...prev, 
          ...response.map(text => ({ type: 'system', text }))
        ]);
      }, 150);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-full max-w-[90vw] md:max-w-[600px] h-[400px] bg-white dark:bg-zinc-950/90 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-lg shadow-2xl z-[100] flex flex-col font-mono overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-slate-300 dark:border-slate-800 px-4 py-2 flex justify-between items-center cursor-move">
            <div className="flex items-center gap-2">
              <FaTerminal className="text-slate-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">root@atanu-os:~</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
              <FaTimes />
            </button>
          </div>

          {/* Terminal Body */}
          <div 
            className="flex-1 p-4 overflow-y-auto text-sm space-y-1"
            onClick={() => inputRef.current?.focus()}
          >
            {output.map((line, i) => (
              <div 
                key={i} 
                className={`${line.type === 'user' ? accentColor : 'text-slate-600 dark:text-slate-300'} ${line.text.includes('ERROR') ? 'text-red-500' : ''}`}
              >
                {line.text}
              </div>
            ))}
            
            {/* Input Line */}
            <div className="flex items-center gap-2 mt-2">
              <span className={accentColor}>$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 font-mono shadow-none focus:ring-0 p-0"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HiddenTerminal;
