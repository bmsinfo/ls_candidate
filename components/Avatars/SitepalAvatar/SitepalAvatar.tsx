'use client';

import React, {
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  RefObject,
  memo,
} from 'react';

import Script from 'next/script';

import { SitePal } from 'sitepal-react-v2';

import { useUIStore } from '@/app/store/ui-store';
import useIntroSpeech from '@/hooks/useIntroSpeech';
import { useSitepalSpeech } from '@/hooks/useSitepalSpeech';
import {
  SITEPAL_ACCOUNT_ID,
  SITEPAL_EMBED_ID,
  SITEPAL_SCENE_ID,
} from '@/lib/constants';

const accountID = SITEPAL_ACCOUNT_ID;
const embedId = SITEPAL_EMBED_ID;
const width = 400;
const height = 400;
const sceneID = SITEPAL_SCENE_ID;
const controls = 0;
const voice = 6;
const lang = 1;
const engine = 7;
const interruptMode = 1;
const queueMode = 0;
const displayControlsOFF = 0;
const enableLogging = 1;
const load = 1; // 0 = do not load the avatar on mount (load by trigger event 'load by id'), 1 = load the avatar on mount

export type AvatarComponentRef = {
  longMessage: () => void;
  unloadScene: () => void;
  enableInterruptMode: () => void;
  enableQueueMode: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeech: () => void;
  loadSceneById: () => void;
};

type AvatarComponentProps = {
  ref: RefObject<AvatarComponentRef>;
  setIsAvatarLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SitepalAvatar = memo(
  React.forwardRef<AvatarComponentRef, AvatarComponentProps>(
    ({ setIsAvatarLoaded }, ref) => {
      const isLoading = useUIStore((state) => state.isLoading);
      const { playIntroSpeech, handleIntroCompletion } = useIntroSpeech();
      const { speak } = useSitepalSpeech();
      const isAvatarSceneLoadedRef = useRef(false);

      const enableInterruptMode = useCallback(() => {
        if (typeof (window as any)?.setStatus == 'function') {
          // setStatus (interruptMode,progressInterval,gazeSpeed,displayControls,enableLog)
          (window as any)?.setStatus(
            interruptMode,
            0,
            0,
            displayControlsOFF,
            enableLogging,
          );
        }
      }, []);

      const enableQueueMode = useCallback(() => {
        if (typeof (window as any)?.setStatus == 'function') {
          // setStatus (interruptMode,progressInterval,gazeSpeed,displayControls,enableLog)
          // default interrupt mode is '0'
          (window as any)?.setStatus(
            queueMode,
            0,
            0,
            displayControlsOFF,
            enableLogging,
          );
        }
      }, []);

      const unloadScene = useCallback(() => {
        if (typeof (window as any)?.unloadScene == 'function') {
          (window as any)?.unloadScene();
        }
      }, []);

      const loadSceneById = useCallback(() => {
        if (typeof (window as any)?.loadSceneByID == 'function') {
          (window as any)?.loadSceneByID();
        }
      }, []);

      const longMessage = useCallback(async () => {
        speak(
          'I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a family and not bred to any trade, my head began to be filled very early with ramblneither poverty nor riches.',
        );
      }, []);

      const stopSpeech = useCallback(async () => {
        if (typeof (window as any)?.stopSpeech == 'function') {
          await (window as any).stopSpeech();
        }
      }, []);

      const handleAvatarResize = useCallback(() => {
        const parentElement = document.getElementById('avatar-card');
        const parentWidth = parentElement?.offsetWidth;
        const parentHeight = parentElement?.offsetHeight;

        if (typeof (window as any)?.dynamicResize == 'function') {
          (window as any).dynamicResize(parentWidth, parentHeight);
        }
      }, []);

      const handleAvatarSceneLoaded = useCallback(async () => {
        if (!isAvatarSceneLoadedRef.current) {
          console.log('#### avatar loaded #####');
          handleAvatarResize();
          isAvatarSceneLoadedRef.current = true;
          setIsAvatarLoaded(true);

          await playIntroSpeech(speak);
          handleIntroCompletion();
        }
      }, []);

      useEffect(() => {
        window.addEventListener('isAvatarSceneLoaded', handleAvatarSceneLoaded);
      }, []);

      //   expose function to parent using useImperativeHandle
      useImperativeHandle(ref, () => ({
        longMessage,
        unloadScene,
        enableInterruptMode,
        enableQueueMode,
        speak,
        stopSpeech,
        loadSceneById,
      }));

      useEffect(() => {
        window.addEventListener('resize', handleAvatarResize);
        return () => {
          window.removeEventListener('resize', handleAvatarResize);
        };
      }, []);

      return (
        <div className=" h-full w-full flex items-center justify-center">
          <Script
            crossOrigin="anonymous"
            src="/scripts/sitepalScript2.js"
            strategy="lazyOnload"
          />

          <div
            style={{
              // implement in future for ' avatar voice only ' mode
              ...(isLoading ? { display: 'none' } : {}),
            }}>
            {/* @ts-ignore */}
            <SitePal
              embed={`${accountID},${height},${width},"",1,${controls}, ${sceneID}, 0,${load},1,"${embedId}",0`}
            />
          </div>
        </div>
      );
    },
  ),
);

export default SitepalAvatar;
