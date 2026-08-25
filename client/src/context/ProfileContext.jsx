import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      setProfileData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback data so the app doesn't hang infinitely
      setProfileData({
        name: 'ATANU GHOSH',
        resumeUrl: '#',
        engineering: {
          heroTitle: 'ELECTRICAL ENGINEER',
          heroDescription: 'Specializing in power systems, hardware design, and IoT integration.',
          aboutText: 'I am an Electrical Engineer specializing in power systems, hardware design, and IoT integration.',
          techStack: [],
          education: []
        },
        developer: {
          heroTitle: 'FULL STACK DEVELOPER',
          heroDescription: 'Architecting high-performance web applications.',
          aboutText: 'I am a Full Stack Developer specializing in the MERN stack.',
          techStack: [],
          education: []
        },
        socialLinks: {}
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, fetchProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
