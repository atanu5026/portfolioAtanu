import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InboxViewer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messages', { withCredentials: true });
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/messages/${id}`, {}, { withCredentials: true });
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`, { withCredentials: true });
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading Inbox...</div>;

  return (
    <div className="max-w-4xl pb-24">
      <h2 className="text-xl font-bold tracking-widest uppercase mb-6 text-slate-300">Inbox</h2>
      
      {error && (
        <div className="mb-6 p-4 border border-red-500 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">No messages yet.</p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className={`bg-zinc-950 border p-6 ${msg.isRead ? 'border-slate-900 opacity-75' : 'border-slate-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-widest">{msg.name}</h4>
                  <p className="text-xs text-slate-400 tracking-widest">{msg.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  {!msg.isRead && (
                    <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-1 uppercase tracking-widest">New</span>
                  )}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line bg-black p-4 border border-slate-900">
                {msg.message}
              </p>
              <div className="flex gap-4">
                {!msg.isRead && (
                  <button onClick={() => handleMarkRead(msg._id)} className="text-blue-500 hover:text-blue-400 text-xs tracking-widest uppercase">
                    Mark as Read
                  </button>
                )}
                <button onClick={() => handleDelete(msg._id)} className="text-red-500 hover:text-red-400 text-xs tracking-widest uppercase">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InboxViewer;
