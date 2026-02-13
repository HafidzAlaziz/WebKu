import React, { Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useTracker } from './hooks/useTracker';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import FloatingSettings from './components/FloatingSettings';
const ChatBot = React.lazy(() => import('./components/ChatBot'));

// Wrapper to track page views
const PageTracker = ({ children }) => {
  const { trackView } = useTracker();
  const location = useLocation();

  useEffect(() => {
    trackView();
  }, [location.pathname]);

  return children;
};

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isExcludedPage =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/blog');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <PageTracker>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </PageTracker>
      <FloatingSettings />
      {!isExcludedPage && (
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
