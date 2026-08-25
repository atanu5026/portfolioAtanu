import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const GithubStats = ({ username = 'atanughosh' }) => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`),
          axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        ]);
        
        setProfile(profileRes.data);
        setRepos(reposRes.data);
      } catch (err) {
        setError('Failed to load GitHub data. Rate limit exceeded or user not found.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGithubData();
  }, [username]);

  if (loading) return (
    <div className="w-full h-48 border border-slate-900 bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="w-full p-6 border border-slate-900 bg-zinc-950 text-slate-500 font-mono text-xs uppercase tracking-widest text-center">
      [GitHub Integration Error: {error}]
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-zinc-950 border border-slate-900 p-6 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-colors">
          <img src={profile.avatar_url} alt={profile.login} className="w-16 h-16 rounded-full mb-4 grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-blue-500" />
          <h3 className="font-bold tracking-widest uppercase text-white">{profile.name || profile.login}</h3>
          <p className="text-xs font-mono text-slate-500 mt-2">@{profile.login}</p>
        </div>
        
        {/* Stats Cards */}
        <div className="bg-zinc-950 border border-slate-900 p-6 flex flex-col justify-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">Public Repositories</p>
          <p className="text-4xl font-black text-white group-hover:text-blue-500 transition-colors font-mono">{profile.public_repos}</p>
        </div>
        <div className="bg-zinc-950 border border-slate-900 p-6 flex flex-col justify-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">Followers</p>
          <p className="text-4xl font-black text-white group-hover:text-blue-500 transition-colors font-mono">{profile.followers}</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-slate-900 p-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-300 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Recent Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map(repo => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="block p-4 border border-slate-800 hover:border-blue-500 transition-colors bg-black"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm tracking-wide text-white group-hover:text-blue-400 truncate">{repo.name}</h4>
                {repo.language && (
                  <span className="text-[10px] font-mono px-2 py-1 bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                    {repo.language}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GithubStats;
