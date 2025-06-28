'use client'

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0"
        aria-label="Toggle dark mode"
      >
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  );
};
