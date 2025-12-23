'use client';

import { useAuth } from '@/lib/xano/xano-auth-context';
import { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = '/' }: RoleGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!allowedRoles.includes(user.role)) {
                router.push(redirectTo);
            }
        }
    }, [user, loading, allowedRoles, redirectTo, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
