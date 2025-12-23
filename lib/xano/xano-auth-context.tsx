'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { xanoClient } from './xano-client';
import { User, UserRole, ADMIN_EMAIL } from '@/lib/types';

interface XanoAuthResponse {
    authToken: string;
    user: {
        id: number;
        uid: string;
        email: string;
        display_name: string;
        role: UserRole;
        created_at: string;
        last_login_at: string;
        favorites: string[];
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    isAdmin: boolean;
    isModerator: boolean;
    role: UserRole;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function XanoAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user from token
    const fetchCurrentUser = async () => {
        const token = xanoClient.getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await xanoClient.get<XanoAuthResponse['user']>('/auth/me');

            // Transform Xano response to our User type
            const userData: User = {
                uid: response.uid,
                email: response.email,
                displayName: response.display_name,
                role: response.role,
                createdAt: new Date(response.created_at),
                lastLoginAt: new Date(response.last_login_at),
                favorites: response.favorites || [],
            };

            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            xanoClient.clearToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await xanoClient.post<XanoAuthResponse>('/auth/login', {
                email,
                password,
            });

            // Store token
            xanoClient.setToken(response.authToken);

            // Transform and set user
            const userData: User = {
                uid: response.user.uid,
                email: response.user.email,
                displayName: response.user.display_name,
                role: response.user.role,
                createdAt: new Date(response.user.created_at),
                lastLoginAt: new Date(response.user.last_login_at),
                favorites: response.user.favorites || [],
            };

            setUser(userData);
        } catch (error: any) {
            console.error('Sign in error:', error);
            throw new Error(error.response?.data?.message || 'Giriş yapılamadı');
        }
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        try {
            const response = await xanoClient.post<XanoAuthResponse>('/auth/signup', {
                email,
                password,
                display_name: displayName,
            });

            // Store token
            xanoClient.setToken(response.authToken);

            // Transform and set user
            const userData: User = {
                uid: response.user.uid,
                email: response.user.email,
                displayName: response.user.display_name,
                role: response.user.role,
                createdAt: new Date(response.user.created_at),
                lastLoginAt: new Date(response.user.last_login_at),
                favorites: response.user.favorites || [],
            };

            setUser(userData);
        } catch (error: any) {
            console.error('Sign up error:', error);
            throw new Error(error.response?.data?.message || 'Kayıt oluşturulamadı');
        }
    };

    const signOut = async () => {
        try {
            // Call logout endpoint (optional, depends on Xano setup)
            await xanoClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            xanoClient.clearToken();
            setUser(null);
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await xanoClient.post('/auth/reset-password', { email });
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.response?.data?.message || 'Şifre sıfırlama başarısız');
        }
    };

    const refreshUser = async () => {
        await fetchCurrentUser();
    };

    const isAdmin = user?.role === 'admin';
    const isModerator = user?.role === 'moderator' || isAdmin;
    const role = user?.role || 'user';

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        isAdmin,
        isModerator,
        role,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a XanoAuthProvider');
    }
    return context;
}
