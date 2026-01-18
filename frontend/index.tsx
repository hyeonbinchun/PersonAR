
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createRouter,
  RouterProvider,
  createRoute,
  createRootRoute,
  redirect,
  createHashHistory
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import LandingPage from './components/LandingPage';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import Editor from './components/Editor';
import LiveView from './components/LiveView';
import { UserProvider, useUser } from './context/UserContext';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Profile } from './types';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => {
    const { setProfile, setIsAuthenticated } = useUser();
    const { addProfile } = useDatabase();
    const navigate = signupRoute.useNavigate();
    return (
      <SignUp
        onComplete={(data) => {
          // Add to DatabaseContext so FaceApiContext can detect the new user
          addProfile(data.handle, data as Profile);
          // Also update UserContext for current session
          setProfile(prev => ({ ...prev, ...data } as any));
          // Set authentication state to true
          setIsAuthenticated(true);
          navigate({ to: '/editor' });
        }}
      />
    );
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    const navigate = loginRoute.useNavigate();
    return (
      <Login
        onComplete={() => {
          navigate({ to: '/editor' });
        }}
      />
    );
  },
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: () => {
    const { profile, setProfile, isAuthenticated } = useUser();
    const navigate = editorRoute.useNavigate();
    
    // Only redirect if user is not authenticated (never signed up) 
    // Don't redirect on temporary empty values during editing
    React.useEffect(() => {
      if (!isAuthenticated) {
        navigate({ to: '/signup' });
      }
    }, [isAuthenticated, navigate]);
    
    // Don't render if not authenticated
    if (!isAuthenticated) {
      return null;
    }
    
    return (
      <Editor
        profile={profile}
        onUpdate={setProfile}
        onDeploy={() => navigate({ to: '/live' })}
      />
    );
  },
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live',
  component: () => {
    const { profile, isAuthenticated } = useUser();
    const navigate = liveRoute.useNavigate();
    
    // Redirect to signup if user is not authenticated
    React.useEffect(() => {
      if (!isAuthenticated) {
        navigate({ to: '/signup' });
      }
    }, [isAuthenticated, navigate]);
    
    // Don't render if not authenticated
    if (!isAuthenticated) {
      return null;
    }
    
    return <LiveView profile={profile} onExit={() => navigate({ to: '/editor' })} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  loginRoute,
  editorRoute,
  liveRoute,
]);

const hashHistory = createHashHistory();

// @ts-ignore
const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </DatabaseProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
