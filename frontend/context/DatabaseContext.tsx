import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Profile } from '@/types';

// Hardcoded profiles for known faces (moved from LiveView.tsx)
const INITIAL_PROFILES: Record<string, Profile> = {
  'Jun': {
    fullName: 'Jun Kim',
    handle: 'jun_dev',
    email: 'jun@personar.me',
    status: 'Building the future of human-computer interaction through AR interfaces.',
    bio: 'Full-stack developer and AR enthusiast. Passionate about creating seamless digital experiences that blend the physical and virtual worlds.',
    location: 'Seoul, KR',
    isVerified: true,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    link: 'https://jun.dev',
  },
  'Khoi': {
    fullName: 'Khoi Nguyen',
    handle: 'khoi_design',
    email: 'khoi@personar.me',
    status: 'Crafting beautiful user experiences at the intersection of design and technology.',
    bio: 'UX Designer specializing in AR/VR interfaces. Believes in technology that feels natural and enhances human connection.',
    location: 'Ho Chi Minh City, VN',
    isVerified: true,
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit:crop',
    link: 'https://khoi.design',
  },
};

interface DatabaseContextType {
  profiles: Record<string, Profile>;
  getProfileByHandle: (handle: string) => Profile | undefined;
  addProfile: (handle: string, profile: Profile) => void;
  updateProfile: (handle: string, profile: Profile) => void;
  removeProfile: (handle: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>(INITIAL_PROFILES);

  const getProfileByHandle = useCallback((handle: string) => {
    return profiles[handle];
  }, [profiles]);

  const addProfile = useCallback((handle: string, profile: Profile) => {
    setProfiles(prevProfiles => ({
      ...prevProfiles,
      [handle]: profile,
    }));
  }, []);

  const updateProfile = useCallback((handle: string, profile: Profile) => {
    setProfiles(prevProfiles => ({
      ...prevProfiles,
      [handle]: { ...prevProfiles[handle], ...profile },
    }));
  }, []);

  const removeProfile = useCallback((handle: string) => {
    setProfiles(prevProfiles => {
      const newProfiles = { ...prevProfiles };
      delete newProfiles[handle];
      return newProfiles;
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ profiles, getProfileByHandle, addProfile, updateProfile, removeProfile }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
