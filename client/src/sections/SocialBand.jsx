import React from 'react';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';
import { FaGithub, FaLinkedin, FaInstagram, FaBehance, FaEnvelope } from 'react-icons/fa';

const SocialBand = () => {
  const { identity } = useIdentity();
  const { profileData, loading } = useProfile();

  if (loading || !profileData) return null;

  const isEngineer = identity === 'engineering';
  
  const hoverBg = isEngineer ? 'hover:bg-orange-600' : 'hover:bg-blue-600';
  const borderColor = isEngineer ? 'border-orange-900/50' : 'border-blue-900/50';

  const links = [
    { name: 'GITHUB', icon: <FaGithub size={20} />, url: profileData.socialLinks?.github || '#' },
    { name: 'LINKEDIN', icon: <FaLinkedin size={20} />, url: profileData.socialLinks?.linkedin || '#' },
    { name: 'INSTAGRAM', icon: <FaInstagram size={20} />, url: profileData.socialLinks?.instagram || '#' },
    { name: 'BEHANCE', icon: <FaBehance size={20} />, url: profileData.socialLinks?.behance || '#' },
    { name: 'EMAIL', icon: <FaEnvelope size={20} />, url: profileData.socialLinks?.email ? `mailto:${profileData.socialLinks.email}` : '#' }
  ];

  return (
    <div className={`w-full flex overflow-x-auto border-y ${borderColor} bg-white dark:bg-zinc-950 mt-12`}>
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.url}
          className={`flex-none w-[120px] md:w-auto md:flex-1 py-4 md:py-6 px-2 md:px-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 border-r ${borderColor} last:border-r-0 transition-colors ${hoverBg} hover:text-slate-900 dark:text-white group`}
        >
          <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:text-white transition-colors">
            {link.icon}
          </span>
          <span className="font-mono text-[10px] md:text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:text-white transition-colors text-center">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialBand;
