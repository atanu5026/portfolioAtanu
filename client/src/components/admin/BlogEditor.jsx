import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { useIdentity } from '../../context/IdentityContext';
import { useTheme } from '../../context/ThemeContext';

const BlogEditor = () => {
  const { identity } = useIdentity();
  const { theme } = useTheme();
  const accentHex = identity === 'engineering' ? '#f97316' : '#3b82f6';

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    title: '', slug: '', content: '', coverImage: '', 
    tags: '', category: '', readTime: 5, isPublished: true
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data);
      setLoading(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load blogs' });
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      ...blog,
      tags: blog.tags.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setFormData(prev => ({ ...prev, coverImage: res.data.url }));
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await axios.delete(`/api/blogs/${id}`, { withCredentials: true });
      fetchBlogs();
      setMessage({ type: 'success', text: 'Blog deleted' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      publishedAt: formData.isPublished && !editingId ? new Date() : undefined
    };

    try {
      if (editingId) {
        await axios.put(`/api/blogs/${editingId}`, payload, { withCredentials: true });
        setMessage({ type: 'success', text: 'Blog updated' });
      } else {
        await axios.post('/api/blogs', payload, { withCredentials: true });
        setMessage({ type: 'success', text: 'Blog created' });
      }
      fetchBlogs();
      handleCancel();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Save failed' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-24">
      <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-600 dark:text-slate-300">Blog Manager</h2>
      
      {message && (
        <div className={`mb-6 p-4 border text-sm ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-6 space-y-6 mb-12">
        <h3 className="text-sm font-bold tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-300 dark:border-slate-800 pb-2 uppercase">
          {editingId ? 'Edit Blog' : 'Create New Blog'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Title</label>
            <input required type="text" className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Slug (Unique)</label>
            <input required type="text" className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Category</label>
            <input type="text" className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Read Time (mins)</label>
            <input type="number" className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none" value={formData.readTime} onChange={e => setFormData({...formData, readTime: Number(e.target.value)})} />
          </div>
          <div className="md:col-span-2" data-color-mode={theme}>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Markdown Content</label>
            <div 
              data-lenis-prevent="true"
              className="border border-slate-300 dark:border-slate-800 focus-within:border-current transition-colors"
              style={{ 
                color: accentHex,
                '--color-accent-fg': accentHex,
                '--color-border-default': 'transparent',
                '--color-canvas-default': 'transparent'
              }}
            >
              <MDEditor
                value={formData.content}
                onChange={(val) => setFormData({...formData, content: val || ''})}
                height={500}
                preview="edit"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Cover Image</label>
            <div className="flex gap-4 items-center">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-slate-200"
              />
              {uploadingImage && <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Uploading...</span>}
            </div>
            {formData.coverImage && (
              <img src={formData.coverImage} alt="Cover Preview" className="mt-4 h-32 object-cover border border-slate-300 dark:border-slate-700" />
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Tags (comma separated)</label>
            <input type="text" className="w-full bg-zinc-50 dark:bg-black border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Published</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-white text-black font-bold py-3 uppercase tracking-widest hover:bg-slate-200">
            {editingId ? 'Update Blog' : 'Create Blog'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold py-3 uppercase tracking-widest hover:text-slate-900 dark:text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest">{blog.title}</h4>
              <p className="text-xs text-slate-500 tracking-widest">{blog.category}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(blog)} className="text-blue-500 hover:text-blue-400 text-xs tracking-widest uppercase">Edit</button>
              <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-400 text-xs tracking-widest uppercase">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogEditor;
