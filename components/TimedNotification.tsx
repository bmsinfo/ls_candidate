'use client';

import { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { COOKIE_OTP_TOKEN } from '@/lib/constants';
import { getFromCookies } from '@/lib/utils';

export default function TimedNotification() {
  const { push } = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShowNotification(true);
      },
      5 * 60 * 1000,
    ); // 5 minutes in milliseconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowNotification(false);
  };
  const loadSceneById = useCallback(() => {
    if (typeof (window as any)?.loadSceneByID == 'function') {
      (window as any)?.loadSceneByID();
    } else {
      const token = getFromCookies(COOKIE_OTP_TOKEN);
      push(`/candidate/verify/${token}`);
    }
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-primary text-white p-4 shadow-md z-50"
      role="alert"
      aria-live="assertive">
      <div className="container mx-auto flex  py-5 items-center justify-between">
        <p className=" text-sm">
          If you stuck here, then please click &nbsp; Reload &nbsp; button.
        </p>
        <div className="flex items-center justify-center space-x-2 ">
          <Button
            onClick={loadSceneById}
            variant="secondary"
            className="bg-background text-primary">
            Reload
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="text-white bg-red-500 "
            aria-label="Close notification">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
