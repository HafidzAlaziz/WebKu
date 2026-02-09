import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages and heavy components
const HomePage = lazy(() => import('../pages/HomePage'));
const OrderPage = lazy(() => import('../pages/OrderPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const AuthCallback = lazy(() => import('../pages/AuthCallback'));
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portofolio" element={<PortfolioPage />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />

            {/* Auth Routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute adminOnly={true}>
                    <DashboardPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
