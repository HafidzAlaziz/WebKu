import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import PortfolioPage from './pages/PortfolioPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
          <ChatbotWidget />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
