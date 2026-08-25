import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useIdentity } from '../context/IdentityContext';

const BlogModal = ({ blog, onClose }) => {
  const { identity } = useIdentity();
  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const progressColor = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';

  const scrollYProgress = useMotionValue(0);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = scrollTop / (scrollHeight - clientHeight);
      scrollYProgress.set(progress);
    }
  };

  useEffect(() => {
    if (!blog) return;
    
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
  }, [blog, onClose]);

  return createPortal(
    <AnimatePresence>
      {blog && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onScroll={handleScroll}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-50 dark:bg-black/90 backdrop-blur-md p-4 pt-24 pb-24 overflow-y-auto"
        >
          <motion.div 
            style={{ scaleX }}
            className={`fixed top-0 left-0 right-0 h-1 origin-left z-[200] shadow-[0_0_10px_currentColor] ${progressColor}`}
          />
          
          <div className="absolute top-8 right-8 z-50">
            <button 
              onClick={onClose}
              className="text-slate-900 dark:text-white hover:text-red-500 transition-colors border border-slate-300 dark:border-slate-800 p-2 font-mono uppercase tracking-widest text-xs"
            >
              CLOSE [ESC]
            </button>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-4xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-8 md:p-16 my-16 shadow-2xl relative"
          >
            {blog.coverImage && (
              <img src={blog.coverImage} alt={blog.title} className="w-full h-64 object-cover mb-8 rounded-sm" />
            )}
            
            <div className="mb-12 border-b border-slate-200 dark:border-slate-900 pb-8">
              <p className="font-mono text-xs text-slate-500 mb-4 tracking-widest uppercase">
                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                <span className="mx-2">•</span> {blog.readTime} MIN READ 
                <span className="mx-2">•</span> {blog.category}
              </p>
              <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-widest mb-6 ${accentColor}`}>
                {blog.title}
              </h1>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-1 tracking-widest uppercase border border-slate-300 dark:border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-invert prose-slate max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-a:text-blue-400">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BlogModal;
