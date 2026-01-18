
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Profile } from '../types';
import { useDatabase } from './DatabaseContext';

const INITIAL_PROFILE: Profile = {
  fullName: 'Alex Rivera',
  handle: 'alex_spatial',
  email: 'alex@personar.me',
  status: 'Exploring the intersection of human consciousness and augmented reality.',
  bio: 'Product Designer & AR Ethicist based in Neo Tokyo. I build systems that bridge the gap between physical and digital presence.',
  location: 'Neo Tokyo, JP',
  isVerified: true,
  isAvailable: true,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  link: 'https://arivera.io',
};

interface UserContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { updateProfile, removeProfile } = useDatabase();
  const lastSyncedProfile = useRef<Profile | null>(null);

  // Sync profile changes to DatabaseContext only when profile actually changes
  useEffect(() => {
    // Only sync if the profile has actually changed (deep comparison of relevant fields)
    const hasChanged = !lastSyncedProfile.current || 
      profile.fullName !== lastSyncedProfile.current.fullName ||
      profile.handle !== lastSyncedProfile.current.handle ||
      profile.status !== lastSyncedProfile.current.status ||
      profile.bio !== lastSyncedProfile.current.bio ||
      profile.isAvailable !== lastSyncedProfile.current.isAvailable ||
      profile.link !== lastSyncedProfile.current.link;

    if (hasChanged) {
      // Handle AR handle changes properly
      if (lastSyncedProfile.current && profile.handle !== lastSyncedProfile.current.handle) {
        // Remove old entry and add new entry with new handle
        removeProfile(lastSyncedProfile.current.handle);
        updateProfile(profile.handle, profile);
      } else {
        // Normal update using current handle
        updateProfile(profile.handle, profile);
      }
      lastSyncedProfile.current = { ...profile };
    }
  }, [profile, updateProfile, removeProfile]);

  return (
    <UserContext.Provider value={{ profile, setProfile, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
