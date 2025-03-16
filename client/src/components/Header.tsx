'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { MapPinIcon } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Roteirizando</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground mr-4">
                Hello, {user?.name}
              </span>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 