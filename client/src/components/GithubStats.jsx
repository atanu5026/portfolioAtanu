import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';

const GithubStats = ({ username = 'atanu5026' }) => {
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
        console.warn('GitHub rate limit hit. Using fallback data.');
        setProfile({ 
          login: username, 
          name: 'Atanu Ghosh', 
          avatar_url: 'https://avatars.githubusercontent.com/u/111701139?v=4', 
          public_repos: '11', 
          followers: '2' 
        });
        setRepos([
           { id: 1345564982, name: 'portfolioAtanu', html_url: 'https://github.com/atanu5026/portfolioAtanu', language: 'JavaScript', updated_at: '2026-08-25T18:20:31Z' },
           { id: 1341729436, name: 'messageme', html_url: 'https://github.com/atanu5026/messageme', language: 'JavaScript', updated_at: '2026-08-23T21:14:06Z' },
           { id: 1341187112, name: 'makatute', html_url: 'https://github.com/atanu5026/makatute', language: 'JavaScript', updated_at: '2026-08-20T23:37:56Z' },
           { id: 546840613, name: 'atanu5026', html_url: 'https://github.com/atanu5026/atanu5026', language: 'Config', updated_at: '2026-06-25T07:24:17Z' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGithubData();
  }, [username]);

  if (loading) return (
    <div className="w-full h-48 border border-slate-200 dark:border-slate-900 bg-white dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="w-full p-6 border border-slate-200 dark:border-slate-900 bg-white dark:bg-zinc-950 text-slate-500 font-mono text-xs uppercase tracking-widest text-center">
      [GitHub Integration Error: {error}]
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-colors">
          <img src={profile.avatar_url} alt={profile.login} className="w-16 h-16 rounded-full mb-4 grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-blue-500" />
          <h3 className="font-bold tracking-widest uppercase text-slate-900 dark:text-white">{profile.name || profile.login}</h3>
          <p className="text-xs font-mono text-slate-500 mt-2">@{profile.login}</p>
        </div>
        
        {/* Stats Cards */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 flex flex-col justify-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">Public Repositories</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors font-mono">{profile.public_repos}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 flex flex-col justify-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">Followers</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors font-mono">{profile.followers}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300 mb-6 flex items-center gap-2">
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
              className="block p-4 border border-slate-300 dark:border-slate-800 hover:border-blue-500 transition-colors bg-zinc-50 dark:bg-black"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white group-hover:text-blue-400 truncate">{repo.name}</h4>
                {repo.language && (
                  <span className="text-[10px] font-mono px-2 py-1 bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-800 uppercase">
                    {repo.language}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
            </a>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 overflow-hidden">
        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Commit Activity Heatmap
        </h3>
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[700px] w-full flex justify-center [&_article]:w-full [&_svg]:w-full [&_svg]:h-auto">
            <GitHubCalendar 
              username={username} 
              colorScheme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              blockSize={15}
              blockMargin={4}
              fontSize={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubStats;
