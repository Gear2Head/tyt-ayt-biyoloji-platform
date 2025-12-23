'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/xano/xano-api';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, User as UserIcon } from 'lucide-react';

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
        setUpdating(userId);
        try {
            const updatedUser = await adminApi.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.uid === userId ? updatedUser : u));
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Rol güncellenemedi. Lütfen tekrar deneyin.');
        } finally {
            setUpdating(null);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-600 border-red-500/30';
            case 'moderator': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
            default: return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return ShieldCheck;
            case 'moderator': return Users;
            default: return UserIcon;
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Kullanıcı Yönetimi ({users.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {users.map((user) => {
                        const RoleIcon = getRoleIcon(user.role);
                        return (
                            <div
                                key={user.uid}
                                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                                        {user.displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user.displayName}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                        <RoleIcon className="w-3 h-3" />
                                        {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderatör' : 'Üye'}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="sm"
                                            variant={user.role === 'user' ? 'default' : 'outline'}
                                            onClick={() => handleRoleChange(user.uid, 'user')}
                                            disabled={updating === user.uid || user.role === 'user'}
                                            className="text-xs"
                                        >
                                            Üye
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={user.role === 'moderator' ? 'default' : 'outline'}
                                            onClick={() => handleRoleChange(user.uid, 'moderator')}
                                            disabled={updating === user.uid || user.role === 'moderator'}
                                            className="text-xs"
                                        >
                                            Moderatör
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={user.role === 'admin' ? 'default' : 'outline'}
                                            onClick={() => handleRoleChange(user.uid, 'admin')}
                                            disabled={updating === user.uid || user.role === 'admin'}
                                            className="text-xs"
                                        >
                                            Admin
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
