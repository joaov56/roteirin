'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeDebug() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card rounded-lg shadow-lg z-50">
      <p className="mb-2">Current theme: <strong>{theme}</strong></p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setTheme('light')}>Light</Button>
        <Button size="sm" onClick={() => setTheme('dark')}>Dark</Button>
        <Button size="sm" onClick={() => setTheme('system')}>System</Button>
      </div>
    </div>
  );
} 