import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
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
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    // Set a timeout to prevent infinite loading if the backend hangs
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Profile fetch timed out. Using fallback data.');
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
    }, 5000); // 5 seconds max wait

    try {
      const res = await axios.get('/api/profile');
      clearTimeout(timeoutId);
      setProfileData(res.data);
      setLoading(false);
    } catch (error) {
      clearTimeout(timeoutId);
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
