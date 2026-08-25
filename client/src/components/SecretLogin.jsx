import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecretLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 right-0 p-8 z-50 group">
      {/* Invisible trigger area */}
      <div className="w-16 h-16 absolute bottom-0 right-0 cursor-default"></div>
      
      {/* Button that appears on hover */}
      <button 
        onClick={() => navigate('/admin/login')}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-2 text-xs font-mono tracking-widest hover:text-slate-900 dark:text-white hover:border-white shadow-xl translate-y-4 group-hover:translate-y-0 transform absolute bottom-4 right-4"
      >
        [ADMIN]
      </button>
    </div>
  );
};

export default SecretLogin;
