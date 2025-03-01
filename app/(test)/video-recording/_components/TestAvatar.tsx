'use client';

import React, { useRef, useState } from 'react';

import { AvatarComponentRef } from '@/components/Avatars/SitepalAvatar/SitepalAvatar';
import { Button } from '@/components/ui/button';
import { RingLodderIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const TestAvatar = () => {
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const avatarComponentRef = useRef<AvatarComponentRef>(null);

  return (
    <div>
      <div>
        <Button
          onClick={() => {
            setShouldLoadAvatar(true);
            avatarComponentRef.current?.loadSceneById();
          }}>
          Load Avatar
        </Button>
      </div>
      <div
        className={cn('flex gap-3 flex-wrap my-2', {
          hidden: !shouldLoadAvatar,
        })}>
        <Button
          onClick={() => {
            avatarComponentRef.current?.unloadScene();
          }}>
          Unload Avatar
        </Button>
        <Button
          onClick={() => {
            avatarComponentRef.current?.enableQueueMode();
          }}>
          Enable Queue
        </Button>
        <Button
          onClick={() => {
            avatarComponentRef.current?.enableInterruptMode();
          }}>
          Enable Interrupt mode
        </Button>

        <Button
          onClick={() => {
            avatarComponentRef.current?.speak('hello this is demo');
          }}>
          Speak
        </Button>

        <Button
          onClick={() => {
            avatarComponentRef.current?.stopSpeech();
          }}>
          Stop
        </Button>

        <Button
          onClick={() => {
            avatarComponentRef.current?.loadSceneById();
          }}>
          Load Scene By Id
        </Button>
      </div>
      {/* <SitepalAvatar
        ref={avatarComponentRef}
        setIsAvatarLoaded={setIsAvatarLoaded}
      /> */}
      {shouldLoadAvatar && !isAvatarLoaded && (
        <div className=" absolute inset-0 z-50  bg-background bg-opacity-100 h-screen w-screen flex flex-col items-center justify-center">
          <RingLodderIcon className=" size-20" />
          <p className="mt-2">Please wait Avatar is Loading ...</p>
        </div>
      )}
    </div>
  );
};

export default TestAvatar;
