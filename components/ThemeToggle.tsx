'use client';

import { useEffect, useState } from 'react';

import { MoonStar, Sun } from 'lucide-react';

import { Button } from './ui/button';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(storedTheme === 'dark');
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    setIsDarkMode(checked);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', checked);
  };

  return (
    <Button variant="ghost" onClick={() => toggleTheme(!isDarkMode)}>
      {isDarkMode ? <Sun /> : <MoonStar />}
    </Button>
  );
};

export default ThemeToggle;
