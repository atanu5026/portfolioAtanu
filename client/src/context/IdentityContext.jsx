import React, { createContext, useState, useContext, useEffect } from 'react';

const IdentityContext = createContext();

export const useIdentity = () => useContext(IdentityContext);

export const IdentityProvider = ({ children }) => {
  const [identity, setIdentity] = useState(null); // 'engineering' or 'developer'
  const [activeTheme, setActiveTheme] = useState('default'); // 'default', 'cyberpunk', 'matrix'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  return (
    <IdentityContext.Provider value={{ identity, setIdentity, activeTheme, setActiveTheme }}>
      {children}
    </IdentityContext.Provider>
  );
};
