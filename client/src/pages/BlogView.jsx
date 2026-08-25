import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useIdentity } from '../context/IdentityContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const progressColor = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top when mounting
  }, []);

  const { scrollYProgress } = useScroll(); // Native window scroll is fine since it's a static page
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setBlog(prev => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className={`w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin ${accentColor}`}></div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
      <p>Blog not found.</p>
      <button onClick={() => navigate('/portfolio')} className="border border-slate-700 px-4 py-2 hover:bg-slate-900">Back</button>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-slate-300 relative pb-24 font-sans">
        {/* Progress Bar */}
        {createPortal(
          <motion.div 
            style={{ scaleX }}
            className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 shadow-[0_0_10px_currentColor] ${progressColor}`}
          />,
          document.body
        )}
        
        {/* Nav / Back Button */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 p-6 flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/portfolio')}
            className={`font-mono text-xs uppercase tracking-widest font-bold transition-colors ${identity === 'engineering' ? 'hover:text-orange-500' : 'hover:text-blue-500'}`}
          >
            &larr; Back to Portfolio
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-4 md:px-8 mt-12">
          <header className="mb-16">
            <div className={`inline-block border ${borderColor} px-3 py-1 mb-6`}>
              <p className={`font-mono text-xs tracking-[0.2em] uppercase font-bold ${accentColor}`}>
                {blog.category} <span className="mx-2 opacity-50">•</span> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()} <span className="mx-2 opacity-50">•</span> {blog.readTime} min read
              </p>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight text-white drop-shadow-lg font-mono">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 border border-slate-700 bg-zinc-900/50 hover:bg-zinc-800 px-4 py-2 rounded-full transition-colors ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${blog.likes > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <span className="font-mono text-sm font-bold text-white">{blog.likes || 0}</span>
              </button>
            </div>
            
            {blog.coverImage && (
              <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-t from-black to-transparent z-10`}></div>
                <img src={blog.coverImage} alt="Cover" className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
          </header>
          
          <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-p:leading-loose prose-p:text-slate-300">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
          
          <div className="mt-24 pt-8 border-t border-slate-900 flex justify-center">
             <button 
                onClick={handleLike}
                disabled={liking}
                className={`flex flex-col items-center gap-3 border border-slate-800 bg-zinc-950 hover:bg-zinc-900 p-6 rounded-2xl transition-all hover:scale-105 active:scale-95 ${liking ? 'opacity-50' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${blog.likes > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <span className="font-mono text-sm tracking-widest uppercase font-bold text-slate-400">Like this article?</span>
             </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogView;
