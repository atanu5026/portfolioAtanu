import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { IdentityProvider } from './context/IdentityContext';
import { ProfileProvider } from './context/ProfileContext';
import { ThemeEraProvider } from './context/ThemeEraContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import Cursor from './components/Cursor';
import TimeMachineWidget from './components/TimeMachineWidget';

function App() {
  useEffect(() => {
    const lenis = new Lenis();
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeEraProvider>
      <IdentityProvider>
        <Cursor />
        <TimeMachineWidget />
        <ProfileProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </ProfileProvider>
      </IdentityProvider>
    </ThemeEraProvider>
  );
}

export default App;
