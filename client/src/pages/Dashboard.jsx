import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileEditor from '../components/admin/ProfileEditor';
import ProjectEditor from '../components/admin/ProjectEditor';
import BlogEditor from '../components/admin/BlogEditor';
import InboxViewer from '../components/admin/InboxViewer';
import ExperienceEditor from '../components/admin/ExperienceEditor';
import PageTransition from '../components/PageTransition';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/admin/login'); // Fallback redirect
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/auth/password', {
        currentPassword,
        newPassword
      }, { withCredentials: true });
      setMessage({ type: 'success', text: res.data.message });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-slate-900 dark:text-white font-mono flex items-start">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-900 p-6 flex flex-col min-h-screen sticky top-0 shrink-0">
          <div className="mb-12 shrink-0">
            <h2 className="text-xl font-bold tracking-widest text-slate-600 dark:text-slate-300">ADMIN</h2>
            <p className="text-xs text-orange-500 uppercase mt-1">Control Panel</p>
          </div>
          
          <nav className="flex-1 space-y-4">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'DASHBOARD' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>DASHBOARD</button>
            <button onClick={() => setActiveTab('PROFILE')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'PROFILE' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>PROFILE/CONTENT</button>
            <button onClick={() => setActiveTab('PROJECTS')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'PROJECTS' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>PROJECTS</button>
            <button onClick={() => setActiveTab('BLOGS')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'BLOGS' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>BLOGS</button>
            <button onClick={() => setActiveTab('EXPERIENCE')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'EXPERIENCE' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>EXPERIENCE</button>
            <button onClick={() => setActiveTab('INBOX')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'INBOX' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>INBOX</button>
            <button onClick={() => setActiveTab('SETTINGS')} className={`block py-2 text-sm tracking-widest hover:text-orange-500 transition-colors uppercase w-full text-left ${activeTab === 'SETTINGS' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>SETTINGS</button>
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-8 shrink-0 border border-red-900/50 text-red-500 px-4 py-3 text-xs tracking-widest hover:bg-red-900/20 transition-colors uppercase text-left"
          >
            Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-12 w-full max-w-5xl">
          <header className="mb-12 border-b border-slate-200 dark:border-slate-900 pb-6 flex justify-between items-end shrink-0">
            <div>
              <h1 className="text-3xl font-bold tracking-widest uppercase">{activeTab}</h1>
              <p className="text-slate-500 text-sm mt-2">Manage your dual-identity portfolio.</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-xs border border-slate-300 dark:border-slate-700 px-4 py-2 hover:text-orange-500 hover:border-orange-500 transition-colors uppercase tracking-widest"
            >
              View Live Site
            </button>
          </header>

          {activeTab === 'DASHBOARD' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6">
                <h3 className="text-slate-500 text-xs tracking-widest uppercase mb-4">Total Projects</h3>
                <p className="text-4xl font-light text-orange-500">0</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6">
                <h3 className="text-slate-500 text-xs tracking-widest uppercase mb-4">Total Blogs</h3>
                <p className="text-4xl font-light text-blue-500">0</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6">
                <h3 className="text-slate-500 text-xs tracking-widest uppercase mb-4">Unread Messages</h3>
                <p className="text-4xl font-light text-slate-900 dark:text-white">0</p>
              </div>
            </div>
          )}

          {activeTab === 'PROFILE' && (
            <ProfileEditor />
          )}

          {activeTab === 'PROJECTS' && (
            <ProjectEditor />
          )}

          {activeTab === 'BLOGS' && (
            <BlogEditor />
          )}

          {activeTab === 'EXPERIENCE' && (
            <ExperienceEditor />
          )}

          {activeTab === 'INBOX' && (
            <InboxViewer />
          )}

          {activeTab === 'SETTINGS' && (
            <div className="max-w-md">
              <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-600 dark:text-slate-300">Security Settings</h2>
              
              {message && (
                <div className={`mb-6 p-4 border text-sm ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-white transition-colors"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-white transition-colors"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="bg-white text-black font-bold py-3 px-8 uppercase tracking-widest hover:bg-slate-200 transition-colors text-xs"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
