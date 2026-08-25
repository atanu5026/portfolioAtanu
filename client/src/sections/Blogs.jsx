import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../context/IdentityContext';

const Blogs = () => {
  const { identity } = useIdentity();
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blogs');
        // Only show published blogs
        setBlogs(res.data.filter(b => b.isPublished));
      } catch (err) {
        console.error('Failed to load blogs');
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <section id="blogs" className={`min-h-[50vh] border-l-2 md:border-l-4 ${borderColor} pl-4 md:pl-8 scroll-mt-32`}>
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 uppercase tracking-widest ${accentColor}`}>Blogs & Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {blogs.length === 0 ? (
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No articles published yet.</p>
          ) : (
            blogs.map((blog) => (
              <div 
                key={blog._id} 
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 shadow-xl group hover:border-slate-300 dark:border-slate-700 transition-colors cursor-pointer flex flex-col justify-between min-h-[200px] md:min-h-[250px]"
              >
                <div>
                  <p className="font-mono text-[10px] md:text-xs text-slate-500 mb-2 md:mb-4 tracking-widest uppercase">
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-600 dark:text-slate-300 transition-colors">{blog.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {/* Render plain text snippet from markdown or just rely on title */}
                    {blog.category} • {blog.readTime} min read
                  </p>
                </div>
                <p className={`font-mono text-xs font-bold tracking-widest uppercase mt-6 ${accentColor}`}>Read Article -{'>'}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Blogs;
