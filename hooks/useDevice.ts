'use client';

import { useLayoutEffect } from 'react';

import { useUIStore } from '@/app/store/ui-store';

export function useDevice() {
  const { isMobile, isClient, setIsMobile, setIsClient } = useUIStore();

  useLayoutEffect(() => {
    setIsClient(true);
    const checkDevice = () => {
      const isMobile = window.innerWidth <= 768;

      setIsMobile(isMobile);
    };

    // Initial check
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, [setIsMobile, setIsClient]);

  return {
    isMobile,
    isClient,
  };
}
