const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // Global / General
  name: { type: String, default: 'ATANU GHOSH' },
  resumeUrl: { type: String, default: '#' },
  
  // Engineering Profile
  engineering: {
    heroTitle: { type: String, default: 'ELECTRICAL ENGINEER' },
    heroDescription: { type: String, default: 'Specializing in power systems, hardware design, and IoT integration. I build robust physical systems that bridge the gap between hardware and software.' },
    aboutText: { type: String, default: 'I am an Electrical Engineer specializing in power systems, hardware design, and IoT integration. I build robust physical systems that bridge the gap between hardware and software.' },
    techStack: [
      {
        category: { type: String },
        skills: [{ type: String }]
      }
    ],
    education: [
      {
        year: { type: String },
        institution: { type: String },
        degree: { type: String },
        description: { type: String }
      }
    ]
  },

  // Developer Profile
  developer: {
    heroTitle: { type: String, default: 'FULL STACK DEVELOPER' },
    heroDescription: { type: String, default: 'Architecting high-performance web applications with a focus on modern design, scalable backend systems, and seamless user experiences.' },
    aboutText: { type: String, default: 'I am a Full Stack Developer specializing in the MERN stack. I build high-performance, scalable web applications with a strong focus on minimal, aesthetic UI and robust backend architecture.' },
    techStack: [
      {
        category: { type: String },
        skills: [{ type: String }]
      }
    ],
    education: [
      {
        year: { type: String },
        institution: { type: String },
        degree: { type: String },
        description: { type: String }
      }
    ]
  },

  // Social Links
  socialLinks: {
    github: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    behance: { type: String, default: '#' },
    email: { type: String, default: '#' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
