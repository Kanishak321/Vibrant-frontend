"use client";

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            kcpl
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Welcome, {user.fullName} ({user.role})
              </span>
              <Link href={`/${user.role === 'Inventory Manager' ? 'inventory' : user.role.toLowerCase()}/dashboard`} className={buttonVariants({ variant: 'outline' })}>
                Dashboard
              </Link>
              <Button onClick={logout} variant="ghost">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/adminLogin" className={buttonVariants({ variant: 'ghost' })}>
                Admin Portal
              </Link>
              <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
                Login
              </Link>
              <Link href="/register" className={buttonVariants({ variant: 'default' })}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
