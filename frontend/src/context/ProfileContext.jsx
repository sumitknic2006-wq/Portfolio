import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profile.service.js';

const ProfileContext = createContext(null);

const fallbackProfile = {
  name: 'Sumit Kumar',
  role: 'Full-Stack Developer & Data Science Engineer',
  headline: 'Data Science Engineer | Full-Stack Developer | DSA in C++',
  avatar: '/images/sumit.png',
  avatarFallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  university: 'SAGE University, Indore',
  institute: 'ALTA School of Technology',
  degree: 'Bachelor of Technology (B.Tech) in Computer Science & Technology',
  duration: '2025 – 2029',
  currentYear: '2nd Year (Ongoing)',
  email: 'sumitknic2006@gmail.com',
  phone: '+91 92419 59612',
  location: 'Indore, Madhya Pradesh / Nawada, Bihar',
  resumeUrl: '/files/Sumit_Kumar_Resume.pdf',
  socials: {
    github: 'https://github.com/sumitknic2006-wq',
    linkedin: 'https://www.linkedin.com/in/sumit-kumar-45a154387/',
    twitter: 'https://x.com/Sumitkumar95862',
    leetcode: 'https://leetcode.com/u/25001122/',
    codeforces: 'https://codeforces.com/profile/sumitknic567',
  },
  careerObjective:
    'Computer Science undergraduate passionate about building modern full-stack web applications using React, Node.js, Express.js, and MongoDB, while strengthening problem-solving skills through DSA in C++. Exploring Data Science, AI/ML, and modern cloud technologies to build intelligent, data-driven solutions.',
  experiences: [],
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      if (data) {
        setProfile((prev) => ({
          ...prev,
          ...data,
          socials: {
            ...prev.socials,
            ...(data.socials || {}),
          },
        }));
      }
    } catch (err) {
      console.warn('[ProfileContext] Failed to load profile from backend:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
