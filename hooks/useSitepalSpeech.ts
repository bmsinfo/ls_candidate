import { useCallback } from 'react';

import { useUIStore } from '@/app/store/ui-store';
import { SITEPAL_ENGINE, SITEPAL_LANG, SITEPAL_VOICE } from '@/lib/constants';

export const useSitepalSpeech = () => {
  const isSubmitingAnswer = useUIStore((state) => state.isSubmitingAnswer);

  const speak = useCallback(
    (message: string, checkForAnswerSubmission = false): Promise<void> => {
      if (!message || typeof (window as any)?.sayText !== 'function') {
        return Promise.resolve();
      }

      if (checkForAnswerSubmission && isSubmitingAnswer) {
        // if answer submission is detected, don't speak the message
        console.log('answer submission detected, not speaking');
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        (window as any).sayText(
          message,
          SITEPAL_VOICE,
          SITEPAL_LANG,
          SITEPAL_ENGINE,
        );

        const onAudioEnded = () => {
          window.removeEventListener('audioEnded', onAudioEnded);
          resolve();
          console.log('### resolve the speak proimse ');
        };

        window.addEventListener('audioEnded', onAudioEnded);
      });
    },
    [isSubmitingAnswer],
  );

  const stopSpeech = useCallback(async () => {
    if (typeof (window as any)?.stopSpeech == 'function') {
      await (window as any).stopSpeech();
    }
  }, []);

  return { speak, stopSpeech };
};
