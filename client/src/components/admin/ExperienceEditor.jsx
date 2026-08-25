import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    year: '',
    description: '',
    category: 'engineering',
    order: 0
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/experience');
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/experience/${editingId}`, formData, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/experience', formData, { withCredentials: true });
      }
      
      setFormData({ title: '', company: '', year: '', description: '', category: 'engineering', order: 0 });
      setEditingId(null);
      fetchExperiences();
    } catch (err) {
      alert('Error saving experience');
      console.error(err);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      company: exp.company,
      year: exp.year,
      description: exp.description,
      category: exp.category,
      order: exp.order
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/experience/${id}`, { withCredentials: true });
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert('Error deleting experience');
    }
  };

  if (loading) return <div>Loading experiences...</div>;

  return (
    <div className="max-w-4xl pb-24">
      <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-300">Experience Manager</h2>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-slate-900 p-6 space-y-6 mb-12">
        <h3 className="text-sm font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2 uppercase">
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Role / Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Company / Institution</label>
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} required className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Year (e.g. 2021 - 2023)</label>
            <input type="text" name="year" value={formData.year} onChange={handleInputChange} required className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none">
              <option value="engineering">Engineering</option>
              <option value="developer">Developer</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none"></textarea>
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Order (Lower = First)</label>
            <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none" />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-white text-black font-bold py-3 uppercase tracking-widest hover:bg-slate-200">
            {editingId ? 'Update Experience' : 'Create Experience'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setEditingId(null); setFormData({title: '', company: '', year: '', description: '', category: 'engineering', order: 0});}} className="flex-1 border border-slate-700 text-slate-400 font-bold py-3 uppercase tracking-widest hover:text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No experiences found.</p>
        ) : (
          experiences.map(exp => (
            <div key={exp._id} className="bg-zinc-950 border border-slate-900 p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white uppercase tracking-widest">{exp.title}</h4>
                <p className="text-xs text-slate-500 tracking-widest">{exp.company} | {exp.year} | {exp.category}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(exp)} className="text-blue-500 hover:text-blue-400 text-xs tracking-widest uppercase">Edit</button>
                <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-red-400 text-xs tracking-widest uppercase">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceEditor;
