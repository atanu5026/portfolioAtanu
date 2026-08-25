import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        if (res.status === 200) {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
      if (res.status === 200) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  if (checkingAuth) {
    return <div className="h-screen bg-black flex items-center justify-center text-slate-500 font-mono tracking-widest text-xs uppercase">Verifying Session...</div>;
  }

  return (
    <PageTransition>
      <div className="h-screen flex items-center justify-center bg-black text-white font-mono p-4">
        <div className="w-full max-w-md bg-zinc-950 border-t-4 border-t-orange-500 border border-slate-900 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold mb-6 tracking-widest text-center text-slate-300">ADMIN ACCESS</h1>
          
          {error && (
            <div className="mb-6 p-4 border border-red-500 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Username</label>
              <input 
                type="text" 
                className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-4 uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Authenticate
            </button>
          </form>

          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 text-slate-500 text-xs tracking-widest hover:text-white transition-colors uppercase"
          >
            Return to public site
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
