import React, { useCallback, useEffect, useState } from 'react';

import { useStore } from '@/app/store/store';

const useAvatar = () => {
  const avatar = useStore((state) => state.interview.avatar);
  const hasAvatar = false;
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const [isTipsCompletedByAvatar, setIsTipsCompletedByAvatar] = useState(false);
  const [isFirstQuestionAskedByAvatar, setIsFirstQuestionAskedByAvatar] =
    useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(true);

  const handleAvatarVisibility = useCallback((value: boolean) => {
    setIsAvatarVisible(value);
  }, []);

  const handleAvatarLoaded = useCallback(
    (value: React.SetStateAction<boolean>) => {
      setIsAvatarLoaded(value);
    },
    [],
  );

  // event trigger when avatar scene is loaded or tips are completed
  useEffect(() => {
    const handleAvatarEvent = () => {
      handleAvatarVisibility(false);
    };

    const handleTipsCompleted = () => {
      setIsTipsCompletedByAvatar(true);
    };
    const handleFirstQuestionAsked = () => {
      setIsFirstQuestionAskedByAvatar(true);
    };
    window.addEventListener('handleAvatar', handleAvatarEvent);
    window.addEventListener('tipsCompleted', handleTipsCompleted);
    window.addEventListener('firstQuestionAsked', handleFirstQuestionAsked);

    // Cleanup function
    return () => {
      window.removeEventListener('handleAvatar', handleAvatarEvent);
      window.removeEventListener('tipsCompleted', handleTipsCompleted);
      window.removeEventListener(
        'firstQuestionAsked',
        handleFirstQuestionAsked,
      );
    };
  }, []);

  return {
    isAvatarVisible,
    isAvatarLoaded,
    isTipsCompletedByAvatar,
    isFirstQuestionAskedByAvatar,
    handleAvatarLoaded,
    handleAvatarVisibility,
    hasAvatar,
    avatarMode: avatar,
  };
};

export default useAvatar;
