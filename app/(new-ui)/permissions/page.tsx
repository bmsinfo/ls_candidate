'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import ScreenShareModal from '@/app/modals/ScreenShareModal';
import ScreenShareModalsMobile from '@/app/modals/ScreenShareModalsMobile';
import { useStore } from '@/app/store/store';
import { useDevice } from '@/hooks/useDevice';

const Permissions = () => {
  const router = useRouter();
  const updateLoadingState = useStore((state) => state.updateLoadingState);
  const { isMobile } = useDevice();
  useEffect(() => {
    // Get the current URL
    const url = new URL(window.location.href);
    const reload = url.searchParams.get('reload');

    if (reload === 'true') {
      url.searchParams.delete('reload');
      // Update the URL without reloading
      window.history.replaceState({}, '', url);

      // Perform a hard reload of the page
      window.location.reload();
    }
  }, [router]);

  useEffect(() => {
    // toggle the loading state to false when the component mounted
    updateLoadingState(false);
  }, []);

  if (isMobile) {
    return <ScreenShareModalsMobile />;
  } else {
    return <ScreenShareModal />;
  }
};

export default Permissions;
