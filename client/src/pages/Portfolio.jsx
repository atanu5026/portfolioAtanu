import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';
import MainLayout from '../layouts/MainLayout';
import Hero from '../sections/Hero';
import SocialBand from '../sections/SocialBand';
import TechStack from '../sections/TechStack';
import Education from '../sections/Education';
import Blogs from '../sections/Blogs';
import Connect from '../sections/Connect';
import Footer from '../sections/Footer';
import Loader from '../components/Loader';
import ProjectModal from '../components/ProjectModal';
import Experience from '../sections/Experience';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import PageTransition from '../components/PageTransition';
import GithubStats from '../components/GithubStats';
import { Helmet } from 'react-helmet-async';

const Portfolio = () => {
  const { identity } = useIdentity();
  const { profileData, loading } = useProfile();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  if (!identity) {
    return <Navigate to="/" />;
  }

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        const filtered = res.data.filter(p => 
          p.isPublished && (p.category === identity || p.category === 'both')
        );
        setProjects(filtered);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    fetchProjects();
  }, [identity]);

  if (loading || !profileData) return <Loader />;

  const profile = identity === 'engineering' ? profileData.engineering : profileData.developer;
  const titleString = identity === 'engineering' ? "Electrical Engineer Portfolio" : "Full Stack Developer Portfolio";

  return (
    <>
      <Helmet>
        <title>{titleString} | Atanu Ghosh</title>
        <meta name="description" content={profile.aboutText.substring(0, 150) + '...'} />
      </Helmet>
      <MainLayout>
        <PageTransition>
          <Hero />
        <SocialBand />
        
        <div className="container mx-auto px-4 md:px-12 py-12 md:py-24 space-y-16 md:space-y-32">
          <ScrollReveal>
            <section className={`min-h-[50vh] border-l-4 ${borderColor} pl-8`}>
              <h2 className={`text-3xl font-bold mb-8 uppercase tracking-widest ${accentColor}`}>About</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed whitespace-pre-line">
                {profile.aboutText}
              </p>
            </section>
          </ScrollReveal>
          
          {identity === 'developer' && (
            <ScrollReveal>
              <section className={`border-l-4 ${borderColor} pl-8`}>
                <h2 className={`text-3xl font-bold mb-8 uppercase tracking-widest ${accentColor}`}>Live Telemetry</h2>
                <GithubStats username="atanu5026" />
              </section>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <Experience />
          </ScrollReveal>
          
          <ScrollReveal>
            <Education />
          </ScrollReveal>
          
          <ScrollReveal>
            <TechStack />
          </ScrollReveal>
          
          <ScrollReveal>
            <section id="projects" className={`min-h-[50vh] border-l-4 ${borderColor} pl-8 scroll-mt-32`}>
              <h2 className={`text-3xl font-bold mb-8 uppercase tracking-widest ${accentColor}`}>Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.length === 0 ? (
                  <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No projects available for this identity.</p>
                ) : (
                  projects.map(proj => (
                    <div 
                      key={proj._id}
                      onClick={() => setSelectedProject(proj)}
                      className="h-56 md:h-64 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 flex flex-col items-center justify-center text-slate-500 shadow-xl group hover:border-slate-300 dark:border-slate-700 transition-colors cursor-pointer relative overflow-hidden p-4 md:p-6 text-center"
                    >
                      {proj.thumbnail && (
                        <img src={proj.thumbnail} alt={proj.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                      )}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-current ${accentColor}`}></div>
                      
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white transition-colors tracking-widest uppercase z-10 relative mb-2 break-words max-w-full">
                        {proj.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 z-10 relative line-clamp-2 md:line-clamp-3 w-full md:max-w-[80%] px-2">
                        {proj.shortDescription}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <Blogs />
          </ScrollReveal>
          
          <ScrollReveal>
            <Connect />
          </ScrollReveal>
        </div>
        
        <Footer />
        </PageTransition>
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </MainLayout>
    </>
  );
};

export default Portfolio;
