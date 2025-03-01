'use client';

import useHeygen from '@/components/Avatars/HeygenAvatar/useHeygen';
import { AvatarMode } from '@/lib/constants';

import useAvatar from './useAvatar';
import { useSitepalSpeech } from './useSitepalSpeech';

interface AvatarsSpeech {
  speak: (meesage: string, checkForAnswerSubmission?: boolean) => Promise<void>;
  stopSpeech: () => Promise<void>;
}

const useAvatarsSpeech = (): AvatarsSpeech => {
  const { avatarMode } = useAvatar();
  const { speak, stopSpeech } = useSitepalSpeech();
  const { heygenSpeak, heygenInterrupt } = useHeygen();

  console.log({ avatarMode });
  const speakFunctions = {
    [AvatarMode.NONE]: () => Promise.resolve(),
    [AvatarMode.SITEPAL]: speak,
    [AvatarMode.HEYGEN]: heygenSpeak,
  };

  const selectedSpeak = speakFunctions[avatarMode];

  if (!selectedSpeak) {
    throw new Error(`Unsupported avatar mode: ${avatarMode}`);
  }

  const stopSpeechFunctions = {
    [AvatarMode.NONE]: () => Promise.resolve(),
    [AvatarMode.SITEPAL]: stopSpeech,
    [AvatarMode.HEYGEN]: heygenInterrupt,
  };
  const selectedStopSpeech = stopSpeechFunctions[avatarMode];
  if (!selectedStopSpeech) {
    throw new Error(`Unsupported avatar mode: ${avatarMode}`);
  }

  return { speak: selectedSpeak, stopSpeech: selectedStopSpeech };
};

export default useAvatarsSpeech;
