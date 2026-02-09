import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>; // Or a better spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/blog" replace />;
    }

    return children;
};

export default ProtectedRoute;
