import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useIdentity } from '../context/IdentityContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [viewed, setViewed] = useState(false);
  
  // Comments state
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const progressColor = identity === 'engineering' ? 'bg-orange-500' : 'bg-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
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

  useEffect(() => {
    const incrementView = async () => {
      if (!viewed && blog) {
        try {
          const res = await axios.post(`/api/blogs/${id}/view`);
          setBlog(prev => ({ ...prev, views: res.data.views }));
          setViewed(true);
        } catch (err) {
          console.error('Failed to increment view', err);
        }
      }
    };
    incrementView();
  }, [blog, id, viewed]);

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
      const res = await axios.post(`/api/blogs/${id}/like`);
      setBlog(prev => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError('Name and comment are required.');
      return;
    }
    setIsSubmitting(true);
    setCommentError('');
    try {
      const res = await axios.post(`/api/blogs/${id}/comments`, {
        name: commentName,
        text: commentText
      });
      setBlog(prev => ({ ...prev, comments: res.data }));
      setCommentName('');
      setCommentText('');
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className={`w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin ${accentColor}`}></div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center flex-col gap-4">
      <p>Blog not found.</p>
      <button onClick={() => navigate('/portfolio')} className="border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-900">Back</button>
    </div>
  );

  return (
    <PageTransition>
      <Helmet>
        <title>{blog.title} | Atanu Ghosh</title>
        <meta name="description" content={blog.metaDescription || (blog.content.substring(0, 150) + '...')} />
        <meta name="keywords" content={blog.keywords || (blog.tags?.join(', '))} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.metaDescription || (blog.content.substring(0, 150) + '...')} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
        <meta property="og:type" content="article" />
      </Helmet>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-slate-600 dark:text-slate-300 relative pb-24 font-sans">
        {/* Progress Bar */}
        {createPortal(
          <motion.div 
            style={{ scaleX }}
            className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 shadow-[0_0_10px_currentColor] ${progressColor}`}
          />,
          document.body
        )}
        
        {/* Nav / Back Button */}
        <div className="sticky top-0 z-40 bg-zinc-50 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 p-6 flex justify-between items-center mb-12">
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
            
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight text-slate-900 dark:text-white drop-shadow-lg font-mono">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-800 px-4 py-2 rounded-full transition-colors ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${blog.likes > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{blog.likes || 0}</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900/50 rounded-full border border-slate-300 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-500">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">{blog.views || 0} views</span>
              </div>
            </div>
            
            {blog.coverImage && (
              <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-800 shadow-2xl">
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-t from-black to-transparent z-10`}></div>
                <img src={blog.coverImage} alt="Cover" className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
          </header>
          
          <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-p:leading-loose prose-p:text-slate-600 dark:text-slate-300">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
                    <div className="mt-24 pt-8 border-t border-slate-200 dark:border-slate-900 flex justify-center">
             <button 
                onClick={handleLike}
                disabled={liking}
                className={`flex flex-col items-center gap-3 border border-slate-300 dark:border-slate-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl transition-all hover:scale-105 active:scale-95 ${liking ? 'opacity-50' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${blog.likes > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <span className="font-mono text-sm tracking-widest uppercase font-bold text-slate-500 dark:text-slate-400">Like this article?</span>
             </button>
          </div>
          
          {/* Comments Section */}
          <div className="mt-16 border-t border-slate-200 dark:border-slate-900 pt-16">
            <h3 className={`text-2xl font-bold tracking-widest uppercase mb-8 ${accentColor}`}>
              Comments ({blog.comments?.length || 0})
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-slate-800 p-6 rounded-lg mb-12">
              <h4 className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-300 dark:border-slate-800 pb-2">Leave a Comment</h4>
              {commentError && <p className="text-red-500 text-sm mb-4">{commentError}</p>}
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className={`w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 transition-colors placeholder:text-slate-600`}
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <textarea 
                  rows="4"
                  placeholder="Your Comment..."
                  className={`w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 transition-colors placeholder:text-slate-600`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !commentName.trim() || !commentText.trim()}
                className={`px-6 py-3 border ${borderColor} font-bold tracking-widest uppercase text-sm ${accentColor} hover:bg-slate-900 transition-colors disabled:opacity-50`}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            <div className="space-y-6">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.slice().reverse().map((comment, index) => (
                  <div key={index} className="bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-900 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-bold tracking-widest uppercase text-slate-900 dark:text-white">{comment.name}</h5>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 font-mono text-sm tracking-widest uppercase">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogView;
