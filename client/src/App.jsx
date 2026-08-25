import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { IdentityProvider } from './context/IdentityContext';
import { ProfileProvider } from './context/ProfileContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import Cursor from './components/Cursor';

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
    <IdentityProvider>
      <Cursor />
      <ProfileProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ProfileProvider>
    </IdentityProvider>
  );
}

export default App;
