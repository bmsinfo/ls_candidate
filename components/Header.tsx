'use client';

import React from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useStore } from '@/app/store/store';
import { useDevice } from '@/hooks/useDevice';

import { ImageWithFallback } from './ImageWithFallback';

const Header = () => {
  useDevice();
  const pathname = usePathname();
  const { org_name, org_logo_url } = useStore((state) => state.interview);

  // Early return if on interview pages
  if (pathname?.startsWith('/interview')) {
    return null;
  }

  return (
    <header className="bg-background border-b hidden md:block">
      <div className="container mx-auto flex justify-between items-center h-[74px] px-4 sm:px-6 lg:px-14">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={org_logo_url ?? '/icons/company.svg'}
            fallbackSrc="/icons/company.svg"
            width={32}
            height={32}
            alt="logo"
            // className=" w-full h-full max-w-44 object-contain"
          />
          <h3 className="font-20-24-700 text-blue-dark-electric">{org_name}</h3>
        </div>

        {/* Notification Icon */}
        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
          <Image
            src="/icons/bell_notification.svg"
            width={24}
            height={24}
            alt="Notification Bell"
            className="cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
