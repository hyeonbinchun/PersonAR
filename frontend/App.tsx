
import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import Header from './components/Header';
import { useUser } from './context/UserContext';
import { FaceApiProvider } from './context/FaceApiContext';   // Import FaceApiProvider

const App: React.FC = () => {
  const { profile } = useUser();
  const location = useLocation();
  const isLiveView = location.pathname === '/live';

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <FaceApiProvider> {/* Only wrap with FaceApiProvider */}
      <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ${isLiveView ? 'bg-black' : ''}`}>
        {/* Background elements are hidden in Live View for performance and immersion */}
        {!isLiveView && (
          <>
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse delay-700"></div>
            <Header avatarUrl={profile.avatarUrl} />
          </>
        )}

        <main className={`flex-1 flex flex-col ${isLiveView ? '' : 'pt-0'}`}>
          <Outlet />
        </main>

        {!isLiveView && (
          <footer className="py-10 px-6 text-center border-t border-primary/5">
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-primary/20 text-xs font-bold hover:bg-primary hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-sm">dark_mode</span>
                Toggle Theme
              </button>
            </div>
            <p className="text-[#181111]/40 dark:text-white/20 text-xs">© 2024 PersonAR. Creating the future of digital presence.</p>
          </footer>
        )}
      </div>
    </FaceApiProvider>
  );
};

export default App;
