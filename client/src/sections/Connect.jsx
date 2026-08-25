import React, { useState } from 'react';
import { useIdentity } from '../context/IdentityContext';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const Connect = () => {
  const { identity } = useIdentity();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accentColor = identity === 'engineering' ? 'text-orange-500' : 'text-blue-500';
  const borderColor = identity === 'engineering' ? 'border-orange-500' : 'border-blue-500';
  const focusBorderColor = identity === 'engineering' ? 'focus:border-orange-500' : 'focus:border-blue-500';
  const buttonBg = identity === 'engineering' ? 'hover:bg-orange-600' : 'hover:bg-blue-600';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      // 1. Save to Database (Backend)
      await axios.post('/api/messages', {
        name: formData.name,
        email: formData.email,
        subject: 'New Portfolio Contact Message',
        message: formData.message
      });

      // 2. Send via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus({ type: 'success', text: 'Message Sent Successfully!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="connect" className={`min-h-[50vh] border-l-2 md:border-l-4 ${borderColor} pl-4 md:pl-8 mb-16 md:mb-32 scroll-mt-32`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 uppercase tracking-widest ${accentColor}`}>Connect</h2>
      <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8 md:mb-12">
        Let's build something extraordinary together. Whether it's a new project, a technical consultation, or just a conversation about the future of technology.
      </p>

      {status.text && (
        <div className={`mb-8 p-3 md:p-4 border text-xs md:text-sm font-mono tracking-widest uppercase ${status.type === 'success' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-[10px] md:text-xs tracking-widest text-slate-500 mb-2 uppercase font-mono">Name</label>
            <input 
              type="text" 
              className={`w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-slate-900 dark:text-white focus:outline-none transition-colors ${focusBorderColor}`}
              placeholder="YOUR NAME"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs tracking-widest text-slate-500 mb-2 uppercase font-mono">Email</label>
            <input 
              type="email" 
              className={`w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-slate-900 dark:text-white focus:outline-none transition-colors ${focusBorderColor}`}
              placeholder="YOUR EMAIL"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] md:text-xs tracking-widest text-slate-500 mb-2 uppercase font-mono">Message</label>
          <textarea 
            rows="5"
            className={`w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-900 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-slate-900 dark:text-white focus:outline-none transition-colors ${focusBorderColor}`}
            placeholder="HOW CAN I HELP?"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`bg-slate-900 text-white dark:bg-white dark:text-black font-bold py-3 md:py-4 px-8 md:px-12 w-full md:w-auto uppercase tracking-widest transition-colors text-xs md:text-sm ${buttonBg} hover:text-white dark:hover:text-white ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'SENDING...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

export default Connect;
