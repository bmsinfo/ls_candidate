'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import HelpMeButton from '@/components/HelpMeButton';
import FAB from '@/components/ui/FAB';
// import { usePreventCopyPaste } from '@/hooks/usePreventCopyPaste';
import { useMediaPermission } from '@/providers/MediaProvider';

const InterviewLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  // usePreventCopyPaste();
  const { hasMicPermission, hasWebcamPermission } = useMediaPermission();
  //  TODO::uncomment it if want to allow open permissions page
  /*  if (!hasMicPermission || !hasWebcamPermission) {
     router.push('/permissions');
     return null;
   } */

  return (
    <main className="max-screen">
      {children}

      <FAB>
        <HelpMeButton />
      </FAB>
    </main>
  );
};

export default InterviewLayout;
