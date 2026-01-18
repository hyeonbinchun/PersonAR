
import React from 'react';
import { Link } from '@tanstack/react-router';
import { useUser } from '../context/UserContext';
import { Badge } from './ui/Badge';

interface HeaderProps {
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ avatarUrl }) => {
  const { profile, isAuthenticated } = useUser();

  return (
    <header className="flex items-center justify-between border-b border-white/20 dark:border-white/5 px-6 py-4 md:px-12 lg:px-20 glass-panel sticky top-0 z-50">
      <Link 
        to="/signup"
        className="flex items-center gap-3 text-[#181111] dark:text-white cursor-pointer group"
      >
        <div className="size-8 bg-primary text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-xl">view_in_ar</span>
        </div>
        <h1 className="text-xl font-black tracking-tight">PersonAR</h1>
      </Link>

      <div className="flex items-center gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-8">
          {isAuthenticated && (
            <Link 
              to="/editor"
              activeProps={{ className: 'text-primary' }}
              inactiveProps={{ className: 'text-[#181111] dark:text-gray-300 hover:text-primary' }}
              className="text-sm font-bold transition-colors uppercase tracking-widest text-[10px]"
            >
              Spatial Editor
            </Link>
          )}
          <Link 
            to="/live"
            activeProps={{ className: 'text-primary' }}
            inactiveProps={{ className: 'text-[#181111] dark:text-gray-300 hover:text-primary' }}
            className="text-sm font-bold transition-colors uppercase tracking-widest text-[10px]"
          >
            Live Feed
          </Link>
          {!isAuthenticated && (
            <Link 
              to="/signup"
              activeProps={{ className: 'text-primary' }}
              inactiveProps={{ className: 'text-[#181111] dark:text-gray-300 hover:text-primary' }}
              className="text-sm font-bold transition-colors uppercase tracking-widest text-[10px]"
            >
              Sign Up
            </Link>
          )}
        </nav>

        {isAuthenticated && (
          <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-border">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black leading-none">{profile.fullName}</span>
              <Badge variant={profile.isAvailable ? "success" : "secondary"} className="mt-1 scale-75 origin-right px-2 py-0">
                {profile.isAvailable ? "AVAILABLE" : "SIGNAL: BUSY"}
              </Badge>
            </div>
            <Link 
              to="/editor"
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer hover:scale-110 transition-all shadow-lg ring-offset-2 ring-primary/20 hover:ring-2" 
              style={{ backgroundImage: `url(${avatarUrl || 'https://picsum.photos/100'})` }}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
