import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeEraContext = createContext();

export const useThemeEra = () => useContext(ThemeEraContext);

export const ThemeEraProvider = ({ children }) => {
  const [era, setEra] = useState('modern'); // 'modern', 'retro-90s', 'y2k'

  useEffect(() => {
    // Remove previous era classes
    document.documentElement.classList.remove('theme-retro-90s', 'theme-y2k');
    
    // Add new era class if not modern
    if (era !== 'modern') {
      document.documentElement.classList.add(`theme-${era}`);
    }
  }, [era]);

  return (
    <ThemeEraContext.Provider value={{ era, setEra }}>
      {children}
    </ThemeEraContext.Provider>
  );
};
