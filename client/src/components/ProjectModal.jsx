import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useIdentity } from '../context/IdentityContext';

const ProjectModal = ({ project, onClose }) => {
  const { identity } = useIdentity();
  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';

  useEffect(() => {
    if (!project) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    };
  }, [project, onClose]);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
        >
          <div className="absolute top-8 right-8 z-50">
            <button 
              onClick={onClose}
              className="text-white hover:text-red-500 transition-colors border border-slate-800 p-2 font-mono uppercase tracking-widest text-xs bg-black"
            >
              CLOSE [ESC]
            </button>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-5xl bg-zinc-950 border border-slate-900 p-8 md:p-12 my-16 shadow-2xl relative"
          >
            {/* Header */}
            <div className="mb-12 border-b border-slate-900 pb-8">
              <p className="font-mono text-xs text-slate-500 mb-4 tracking-widest uppercase">
                {project.category} <span className="mx-2">•</span> {project.year}
              </p>
              <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-widest mb-6 ${accentColor}`}>
                {project.title}
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-6">
                {project.shortDescription}
              </p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs font-mono bg-slate-900 text-slate-400 px-3 py-1 tracking-widest uppercase border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 font-mono text-xs tracking-widest uppercase font-bold">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-white hover:text-slate-400 border border-slate-700 px-4 py-2">
                    Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`${accentColor} border border-current px-4 py-2 hover:bg-white/5`}>
                    View Live
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Description & Images */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4 border-b border-slate-800 pb-2">Overview</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                    {project.description}
                  </p>
                </div>
                
                {project.thumbnail && (
                  <img src={project.thumbnail} alt="Thumbnail" className="w-full border border-slate-800" />
                )}
                
                {project.images && project.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Screenshot ${idx+1}`} className="w-full border border-slate-800" />
                ))}
              </div>

              {/* Right Column: Live Code Runner Snippet */}
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4 border-b border-slate-800 pb-2">Core Implementation</h3>
                {project.codeSnippet ? (
                  <div className="rounded-md overflow-hidden border border-slate-800 shadow-2xl relative text-sm">
                    {/* Fake Window Header */}
                    <div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-xs font-mono text-slate-500 tracking-wider">implementation.{project.codeLanguage || 'js'}</span>
                    </div>
                    
                    <SyntaxHighlighter 
                      language={project.codeLanguage || 'javascript'} 
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1.5rem', background: '#09090b' }}
                      showLineNumbers={true}
                    >
                      {project.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-slate-800 p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                    No code snippet provided for this project.
                  </div>
                )}
              </div>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
