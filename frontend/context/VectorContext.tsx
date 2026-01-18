
import React, { createContext, useContext, useState } from 'react';
import { Profile } from '../types';

const INITIAL_PROFILE: Profile = {
  fullName: '',
  handle: '',
  email: '',
  status: '',
  bio: '',
  location: '',
  isVerified: false,
  isAvailable: true,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  link: '',
};

interface UserContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
