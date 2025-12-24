"use client"

import { useAuth } from "@/lib/xano/xano-auth-context"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, LayoutDashboard, Shield } from "lucide-react"
import Link from "next/link"

export function UserNav() {
    const { user, signOut, isAdmin } = useAuth()
    const router = useRouter()

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/login">
                    <Button variant="ghost" size="sm">
                        Giriş Yap
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button size="sm">
                        Kayıt Ol
                    </Button>
                </Link>
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut()
        router.push("/login")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-primary text-white font-bold">
                        {user.displayName?.charAt(0).toUpperCase()}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin">
                            <DropdownMenuItem className="cursor-pointer text-amber-600 dark:text-amber-400">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                            </DropdownMenuItem>
                        </Link>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
