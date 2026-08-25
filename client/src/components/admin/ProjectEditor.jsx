import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    title: '', slug: '', shortDescription: '', description: '',
    thumbnail: '', images: '', technologies: '', category: 'developer',
    year: '', githubUrl: '', liveUrl: '', isFeatured: false, isPublished: true,
    codeSnippet: '', codeLanguage: 'javascript'
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load projects' });
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      ...project,
      images: project.images.join(', '),
      technologies: project.technologies.join(', ')
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
      const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setFormData(prev => ({ ...prev, thumbnail: res.data.url }));
      setMessage({ type: 'success', text: 'Thumbnail uploaded successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Thumbnail upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleExtraImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setFormData(prev => ({ 
        ...prev, 
        images: prev.images ? `${prev.images}, ${res.data.url}` : res.data.url 
      }));
      setMessage({ type: 'success', text: 'Extra image uploaded successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Extra image upload failed' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, { withCredentials: true });
      fetchProjects();
      setMessage({ type: 'success', text: 'Project deleted' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/projects/${editingId}`, payload, { withCredentials: true });
        setMessage({ type: 'success', text: 'Project updated' });
      } else {
        await axios.post('http://localhost:5000/api/projects', payload, { withCredentials: true });
        setMessage({ type: 'success', text: 'Project created' });
      }
      fetchProjects();
      handleCancel();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Save failed' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-24">
      <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-300">Project Manager</h2>
      
      {message && (
        <div className={`mb-6 p-4 border text-sm ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-slate-900 p-6 space-y-6 mb-12">
        <h3 className="text-sm font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2 uppercase">
          {editingId ? 'Edit Project' : 'Create New Project'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Title</label>
            <input required type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Slug (Unique)</label>
            <input required type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Category</label>
            <select className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="developer">Developer</option>
              <option value="engineering">Engineering</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Year</label>
            <input type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Short Description</label>
            <textarea required rows="2" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Full Description</label>
            <textarea required rows="4" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Thumbnail Image</label>
            <div className="flex gap-4 items-center">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-slate-200"
              />
              {uploadingImage && <span className="text-xs text-slate-400 uppercase tracking-widest whitespace-nowrap">Uploading...</span>}
            </div>
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Thumbnail Preview" className="mt-4 h-32 object-cover border border-slate-700" />
            )}
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Tech Stack (comma separated)</label>
            <input type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Extra Images</label>
            <div className="flex gap-4 items-center">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleExtraImageUpload}
                className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-slate-200"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.images && formData.images.split(',').filter(Boolean).map((img, i) => (
                 <div key={i} className="relative group">
                   <img src={img.trim()} alt="Preview" className="h-20 w-32 object-cover border border-slate-700" />
                   <button 
                     type="button"
                     onClick={() => {
                       const arr = formData.images.split(',').map(s => s.trim()).filter(Boolean);
                       arr.splice(i, 1);
                       setFormData({...formData, images: arr.join(', ')});
                     }}
                     className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     X
                   </button>
                 </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">GitHub URL</label>
            <input type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Live URL</label>
            <input type="text" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Live Code Snippet</label>
            <textarea rows="6" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none font-mono text-sm" value={formData.codeSnippet || ''} onChange={e => setFormData({...formData, codeSnippet: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Code Language</label>
            <input type="text" placeholder="e.g. javascript, python, cpp" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" value={formData.codeLanguage || 'javascript'} onChange={e => setFormData({...formData, codeLanguage: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Published</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-white text-black font-bold py-3 uppercase tracking-widest hover:bg-slate-200">
            {editingId ? 'Update Project' : 'Create Project'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="flex-1 border border-slate-700 text-slate-400 font-bold py-3 uppercase tracking-widest hover:text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map(proj => (
          <div key={proj._id} className="bg-zinc-950 border border-slate-900 p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white uppercase tracking-widest">{proj.title}</h4>
              <p className="text-xs text-slate-500 tracking-widest">{proj.category} | {proj.year}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(proj)} className="text-blue-500 hover:text-blue-400 text-xs tracking-widest uppercase">Edit</button>
              <button onClick={() => handleDelete(proj._id)} className="text-red-500 hover:text-red-400 text-xs tracking-widest uppercase">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectEditor;
