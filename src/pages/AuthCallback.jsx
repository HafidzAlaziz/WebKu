import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // Redirect based on admin status
                if (isAdmin) {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/blog', { replace: true });
                }
            } else {
                // If no user, redirect to home
                navigate('/', { replace: true });
            }
        }
    }, [user, isAdmin, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Redirecting...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
