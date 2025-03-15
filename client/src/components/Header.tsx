'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Roteirin</span>
        </Link>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 