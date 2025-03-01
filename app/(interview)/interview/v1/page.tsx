'use client';

import { useMemo, useRef } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import { AvatarComponentRef } from '@/components/Avatars/SitepalAvatar/SitepalAvatar';
import useAvatar from '@/hooks/useAvatar';
import { AvatarMode } from '@/lib/constants';

import DesktopLayout_v1 from '../_components/DesktopLayout_v1';
import InterviewHeader from '../_components/InterviewHeader';
import LoadingOverlay from '../_components/LoadingOverlay';
import MobileLayout_v1 from '../_components/MobileLayout_v1';
import QuestionWrapp from '../_components/QuestionWrapper';
import WebCamWrapper, { WebCamWrapperRef } from '../_components/WebCamWrapper';

// Dynamically import avatar components
const HeygenAvatar = dynamic(
  () => import('@/components/Avatars/HeygenAvatar/HeygenAvatar'),
  { ssr: false },
);

const SitepalAvatar = dynamic(
  () => import('@/components/Avatars/SitepalAvatar/SitepalAvatar'),
  { ssr: false },
);

export default function Interview_V1() {
  const { push } = useRouter();
  const {
    handleAvatarLoaded,
    isAvatarVisible,
    handleAvatarVisibility,
    isAvatarLoaded,
    isFirstQuestionAskedByAvatar,
  } = useAvatar();
  const webCamReference = useRef<WebCamWrapperRef | null>(null);
  const avatarRef = useRef<AvatarComponentRef>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { collpseAnswerSection } = useStore((state) => state);
  const isMobile = useUIStore((state) => state.isMobile);
  const { candidate_short_name, avatar } = useStore((state) => state.interview);
  const isSessionEnded = useUIStore((state) => state.isSessionEnded);
  const hasMoreThanOneParticipant = false; // TODO: implement in future with real data (Participant count)

  const renderAvatar = useMemo(() => {
    // Don't render anything until hydration is complete
    if (!useStore.persist.hasHydrated()) {
      return null;
    }
    return (
      <SitepalAvatar ref={avatarRef} setIsAvatarLoaded={handleAvatarLoaded} />
    );
    switch (avatar) {
      case AvatarMode.HEYGEN:
        return <HeygenAvatar setIsAvatarLoaded={handleAvatarLoaded} />;
      case AvatarMode.SITEPAL:
        return (
          <SitepalAvatar
            ref={avatarRef}
            setIsAvatarLoaded={handleAvatarLoaded}
          />
        );
      default:
        //  TODO: create a component where we need to set the avatar to 'NONE' and handle all other stuff
        //  TODO: unload the sitepal and heygen scenes
        // TODO :need to set true that first question is asked by avatar
        push('/interview/v0');
        return null;
    }
  }, [avatar, useStore.persist.hasHydrated, handleAvatarLoaded]);

  return (
    <div className="flex flex-col h-screen gap-1 p-2 ">
      <InterviewHeader />
      {/* Mobile view  */}
      {isMobile ? (
        <MobileLayout_v1
          avatar={renderAvatar}
          webCamComponent={<WebCamWrapper ref={webCamReference} />}
          candidateName={candidate_short_name}
          isVisible={isAvatarVisible}
          collpseAnswerSection={collpseAnswerSection}
          handleAvatarVisibility={handleAvatarVisibility}
          isFirstQuestionAskedByAvatar={isFirstQuestionAskedByAvatar}
          webCamReference={webCamReference}
          isSessionEnded={isSessionEnded}
        />
      ) : (
        <DesktopLayout_v1
          avatar={renderAvatar}
          webCamComponent={<WebCamWrapper ref={webCamReference} />}
          candidateName={candidate_short_name}
          isVisible={isAvatarVisible}
          collpseAnswerSection={collpseAnswerSection}
          isFirstQuestionAskedByAvatar={isFirstQuestionAskedByAvatar}
          webCamReference={webCamReference}
          isSessionEnded={isSessionEnded}
        />
      )}
      {!isAvatarLoaded && <LoadingOverlay />}
    </div>
  );
}
