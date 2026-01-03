import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages and heavy components
const HomePage = lazy(() => import('./pages/HomePage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portofolio" element={<PortfolioPage />} />
            </Routes>
            <ChatbotWidget />
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
