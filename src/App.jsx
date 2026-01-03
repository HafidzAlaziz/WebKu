import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useTracker } from './hooks/useTracker';
import { useEffect } from 'react';

// Wrapper to track page views
const PageTracker = ({ children }) => {
  const { trackView } = useTracker();
  const location = useLocation();

  useEffect(() => {
    trackView();
  }, [location.pathname]);

  return children;
};

// Lazy load pages and heavy components
const HomePage = lazy(() => import('./pages/HomePage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <PageTracker>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portofolio" element={<PortfolioPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
              <ChatbotWidget />
            </Suspense>
          </PageTracker>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
