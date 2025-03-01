'use client';

import { useUIStore } from '@/app/store/ui-store';

import { RingLodderIcon } from './ui/icons';

const Loader = () => {
  const { isLoading } = useUIStore();
  return (
    isLoading && (
      <div className=" z-50 bg-background bg-opacity-40 flex-col absolute inset-0 flex items-center justify-center  h-screen w-screen">
        <RingLodderIcon className=" size-20 text-primary" />
        <p className="mt-2 text-primary">Please wait ...</p>
      </div>
    )
  );
};

export default Loader;
