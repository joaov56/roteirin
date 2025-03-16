'use client';

import { HeartIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto max-w-4xl flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built with <HeartIcon className="inline-block h-4 w-4 text-red-500" /> using Next.js, Fastify, and OpenAI
        </p>
        <div className="flex items-center gap-4">

        </div>
      </div>
    </footer>
  );
} 