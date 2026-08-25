import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfile } from '../../context/ProfileContext';

const ProfileEditor = () => {
  const { fetchProfile } = useProfile();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile');
        setFormData(res.data);
        setLoading(false);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleGlobalChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSocialChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: e.target.value
      }
    }));
  };

  const handleEducationChange = (section, index, field, value) => {
    setFormData(prev => {
      const newEdu = [...(prev[section].education || [])];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          education: newEdu
        }
      };
    });
  };

  const handleAddEducation = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        education: [...(prev[section].education || []), { year: '', institution: '', degree: '', description: '' }]
      }
    }));
  };

  const handleRemoveEducation = (section, index) => {
    setFormData(prev => {
      const newEdu = [...(prev[section].education || [])];
      newEdu.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          education: newEdu
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put('http://localhost:5000/api/profile', formData, { withCredentials: true });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh global context so changes reflect on the frontend immediately
      if (fetchProfile) fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  if (loading) return <div>Loading Profile Data...</div>;

  return (
    <div className="max-w-4xl pb-24">
      <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-300">Content Manager</h2>
      
      {message && (
        <div className={`mb-6 p-4 border text-sm ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Global Settings */}
        <section className="bg-zinc-950 border border-slate-900 p-6 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2 uppercase">Global Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                value={formData.name || ''}
                onChange={(e) => handleGlobalChange(e, 'name')}
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Resume URL</label>
              <input 
                type="text" 
                className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                value={formData.resumeUrl || ''}
                onChange={(e) => handleGlobalChange(e, 'resumeUrl')}
              />
            </div>
          </div>
        </section>

        {/* Engineering Profile */}
        <section className="bg-zinc-950 border border-orange-900/30 border-t-4 border-t-orange-500 p-6 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-orange-500 border-b border-slate-800 pb-2 uppercase">Engineering Identity</h3>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Hero Title</label>
            <input 
              type="text" 
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={formData.engineering?.heroTitle || ''}
              onChange={(e) => handleChange(e, 'engineering', 'heroTitle')}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Hero Description</label>
            <textarea 
              rows="3"
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={formData.engineering?.heroDescription || ''}
              onChange={(e) => handleChange(e, 'engineering', 'heroDescription')}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">About Section Text</label>
            <textarea 
              rows="5"
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={formData.engineering?.aboutText || ''}
              onChange={(e) => handleChange(e, 'engineering', 'aboutText')}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <label className="block text-xs tracking-widest text-slate-500 uppercase">Education Timeline</label>
              <button type="button" onClick={() => handleAddEducation('engineering')} className="text-xs text-orange-500 hover:text-orange-400 tracking-widest uppercase">
                + Add Entry
              </button>
            </div>
            <div className="space-y-4">
              {formData.engineering?.education?.map((edu, idx) => (
                <div key={idx} className="bg-black border border-slate-800 p-4 relative">
                  <button type="button" onClick={() => handleRemoveEducation('engineering', idx)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Year</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={edu.year} onChange={(e) => handleEducationChange('engineering', idx, 'year', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Institution</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={edu.institution} onChange={(e) => handleEducationChange('engineering', idx, 'institution', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Degree</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={edu.degree} onChange={(e) => handleEducationChange('engineering', idx, 'degree', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Description</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={edu.description} onChange={(e) => handleEducationChange('engineering', idx, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Engineering Tech Stack */}
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <label className="block text-xs tracking-widest text-slate-500 uppercase">Tech Stack</label>
              <button type="button" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  engineering: {
                    ...prev.engineering,
                    techStack: [...(prev.engineering.techStack || []), { category: '', skills: [] }]
                  }
                }));
              }} className="text-xs text-orange-500 hover:text-orange-400 tracking-widest uppercase">
                + Add Category
              </button>
            </div>
            <div className="space-y-4">
              {formData.engineering?.techStack?.map((group, idx) => (
                <div key={idx} className="bg-black border border-slate-800 p-4 relative">
                  <button type="button" onClick={() => {
                    setFormData(prev => {
                      const newStack = [...(prev.engineering.techStack || [])];
                      newStack.splice(idx, 1);
                      return { ...prev, engineering: { ...prev.engineering, techStack: newStack } };
                    });
                  }} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Remove</button>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Category Name</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={group.category} onChange={(e) => {
                        setFormData(prev => {
                          const newStack = [...(prev.engineering.techStack || [])];
                          newStack[idx] = { ...newStack[idx], category: e.target.value };
                          return { ...prev, engineering: { ...prev.engineering, techStack: newStack } };
                        });
                      }} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Skills (comma-separated)</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm" value={group.skills.join(', ')} onChange={(e) => {
                        setFormData(prev => {
                          const newStack = [...(prev.engineering.techStack || [])];
                          newStack[idx] = { ...newStack[idx], skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                          return { ...prev, engineering: { ...prev.engineering, techStack: newStack } };
                        });
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Profile */}
        <section className="bg-zinc-950 border border-blue-900/30 border-t-4 border-t-blue-500 p-6 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-blue-500 border-b border-slate-800 pb-2 uppercase">Developer Identity</h3>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Hero Title</label>
            <input 
              type="text" 
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.developer?.heroTitle || ''}
              onChange={(e) => handleChange(e, 'developer', 'heroTitle')}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">Hero Description</label>
            <textarea 
              rows="3"
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.developer?.heroDescription || ''}
              onChange={(e) => handleChange(e, 'developer', 'heroDescription')}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">About Section Text</label>
            <textarea 
              rows="5"
              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.developer?.aboutText || ''}
              onChange={(e) => handleChange(e, 'developer', 'aboutText')}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <label className="block text-xs tracking-widest text-slate-500 uppercase">Education Timeline</label>
              <button type="button" onClick={() => handleAddEducation('developer')} className="text-xs text-blue-500 hover:text-blue-400 tracking-widest uppercase">
                + Add Entry
              </button>
            </div>
            <div className="space-y-4">
              {formData.developer?.education?.map((edu, idx) => (
                <div key={idx} className="bg-black border border-slate-800 p-4 relative">
                  <button type="button" onClick={() => handleRemoveEducation('developer', idx)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Year</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={edu.year} onChange={(e) => handleEducationChange('developer', idx, 'year', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Institution</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={edu.institution} onChange={(e) => handleEducationChange('developer', idx, 'institution', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Degree</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={edu.degree} onChange={(e) => handleEducationChange('developer', idx, 'degree', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Description</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={edu.description} onChange={(e) => handleEducationChange('developer', idx, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Developer Tech Stack */}
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <label className="block text-xs tracking-widest text-slate-500 uppercase">Tech Stack</label>
              <button type="button" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  developer: {
                    ...prev.developer,
                    techStack: [...(prev.developer.techStack || []), { category: '', skills: [] }]
                  }
                }));
              }} className="text-xs text-blue-500 hover:text-blue-400 tracking-widest uppercase">
                + Add Category
              </button>
            </div>
            <div className="space-y-4">
              {formData.developer?.techStack?.map((group, idx) => (
                <div key={idx} className="bg-black border border-slate-800 p-4 relative">
                  <button type="button" onClick={() => {
                    setFormData(prev => {
                      const newStack = [...(prev.developer.techStack || [])];
                      newStack.splice(idx, 1);
                      return { ...prev, developer: { ...prev.developer, techStack: newStack } };
                    });
                  }} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Remove</button>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Category Name</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={group.category} onChange={(e) => {
                        setFormData(prev => {
                          const newStack = [...(prev.developer.techStack || [])];
                          newStack[idx] = { ...newStack[idx], category: e.target.value };
                          return { ...prev, developer: { ...prev.developer, techStack: newStack } };
                        });
                      }} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Skills (comma-separated)</label>
                      <input type="text" className="w-full bg-zinc-950 border border-slate-800 px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" value={group.skills.join(', ')} onChange={(e) => {
                        setFormData(prev => {
                          const newStack = [...(prev.developer.techStack || [])];
                          newStack[idx] = { ...newStack[idx], skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                          return { ...prev, developer: { ...prev.developer, techStack: newStack } };
                        });
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-zinc-950 border border-slate-900 p-6 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-slate-400 border-b border-slate-800 pb-2 uppercase">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['github', 'linkedin', 'instagram', 'behance', 'email'].map(platform => (
              <div key={platform}>
                <label className="block text-xs tracking-widest text-slate-500 mb-2 uppercase">{platform}</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  value={formData.socialLinks?.[platform] || ''}
                  onChange={(e) => handleSocialChange(e, platform)}
                />
              </div>
            ))}
          </div>
        </section>
        
        <button 
          type="submit"
          className="w-full bg-white text-black font-bold py-4 uppercase tracking-widest hover:bg-slate-200 transition-colors"
        >
          Save All Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
