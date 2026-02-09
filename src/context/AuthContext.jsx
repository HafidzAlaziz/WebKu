import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// For now, we hardcode the admin email(s)
// In a real app, this should be a Role in the database or Supabase Custom Claims
const ADMIN_EMAILS = ['admin@webkuu.com', 'hafidz@webkuu.com', 'web.kuu3@gmail.com']; // Replace with your actual admin email

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check active session
        const session = supabase.auth.getSession();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsAdmin(session?.user ? ADMIN_EMAILS.includes(session.user.email) : false);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAdmin(session?.user ? ADMIN_EMAILS.includes(session.user.email) : false);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = async (email, password) => {
        return await supabase.auth.signUp({ email, password });
    };

    const signOut = async () => {
        return await supabase.auth.signOut();
    };

    const signInWithGoogle = async () => {
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback` // Redirect to callback page
            }
        });
    };

    const value = {
        user,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
