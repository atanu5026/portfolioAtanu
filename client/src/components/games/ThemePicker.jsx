import React from 'react';
import { useIdentity } from '../../context/IdentityContext';

const ThemePicker = () => {
  const { activeTheme, setActiveTheme } = useIdentity();
  
  const themes = [
    { id: 'default', name: 'Default', eng: '#f97316', dev: '#3b82f6' },
    { id: 'cyberpunk', name: 'Cyberpunk', eng: '#d946ef', dev: '#eab308' },
    { id: 'matrix', name: 'Matrix', eng: '#22c55e', dev: '#10b981' },
    { id: 'neon', name: 'Neon', eng: '#06b6d4', dev: '#ec4899' },
    { id: 'sunset', name: 'Sunset', eng: '#ef4444', dev: '#f59e0b' },
    { id: 'monochrome', name: 'Monochrome', eng: '#94a3b8', dev: '#cbd5e1' }
  ];

  return (
    <div className="mt-8 border-t border-slate-300 dark:border-slate-800 pt-6">
      <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-4">Override System Colors</p>
      <div className="flex gap-4 flex-wrap">
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTheme(t.id)}
            className={`flex items-center gap-2 px-3 py-2 border transition-all ${activeTheme === t.id ? 'border-white bg-white/10' : 'border-slate-300 dark:border-slate-800 hover:border-slate-600 bg-zinc-50 dark:bg-black'}`}
          >
            <div className="flex">
              <span className="w-3 h-3 rounded-l-sm" style={{ backgroundColor: t.eng }}></span>
              <span className="w-3 h-3 rounded-r-sm" style={{ backgroundColor: t.dev }}></span>
            </div>
            <span className="text-xs font-mono uppercase tracking-widest">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;
