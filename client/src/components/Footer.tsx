'use client';

import { GithubIcon, HeartIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with <HeartIcon className="inline-block h-4 w-4 text-red-500" /> using Next.js, Fastify, and OpenAI
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/roteirin"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
} 