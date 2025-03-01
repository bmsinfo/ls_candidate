import React from 'react';

import { RingLodderIcon } from '@/components/ui/icons';
import { useTimedNotification } from '@/hooks/useTimedNotification';

const LoadingOverlay = () => {
  useTimedNotification('/interview/v0');
  return (
    <div className=" absolute inset-0 z-50  bg-background bg-opacity-100 h-screen w-screen ">
      <div className="flex flex-col items-center justify-center h-full">
        <RingLodderIcon className=" size-20" color="#307BF7" />
        <p className="mt-2">Please wait, Loading ...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
