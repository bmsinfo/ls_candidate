'use client';

import { useEffect, useRef } from 'react';

import { useStore } from '@/app/store/store';

import { DesktopLayout_v0 } from '../_components/DesktopLayout_v0';
import { MobileLayout_v0 } from '../_components/MobileLayout_v0';
import { WebCamWrapperRef } from '../_components/WebCamWrapper';

export default function Interview_V0() {
  const webCamReference = useRef<WebCamWrapperRef | null>(null);

  const { collpseAnswerSection, startCountDown } = useStore((state) => state);
  const { candidate_short_name } = useStore((state) => state.interview);
  const { updateAvatarMode } = useStore((state) => state);

  useEffect(() => {
    // trigger so that voice to text can be started
    window.dispatchEvent(new Event('handleAvatar'));
    startCountDown();
    updateAvatarMode('NONE');
  }, []);

  return (
    <>
      <MobileLayout_v0
        webCamReference={webCamReference}
        collpseAnswerSection={collpseAnswerSection}
      />

      <DesktopLayout_v0
        webCamReference={webCamReference}
        collpseAnswerSection={collpseAnswerSection}
        candidateShortName={candidate_short_name}
      />
    </>
  );
}
