import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

axios.defaults.baseURL = import.meta.env.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
