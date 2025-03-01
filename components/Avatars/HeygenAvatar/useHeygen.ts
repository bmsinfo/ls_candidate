import React, { useCallback } from 'react';

import { StreamingEvents, TaskMode, TaskType } from '@heygen/streaming-avatar';
import { toast } from 'sonner';

import { useUIStore } from '@/app/store/ui-store';

const useHeygen = () => {
  const isSubmitingAnswer = useUIStore((state) => state.isSubmitingAnswer);

  const heygenSpeak = useCallback(
    async (message: string, checkForAnswerSubmission?: boolean) => {
      if (!message || typeof message !== 'string') {
        toast.error('message is missing or not a string');
        return;
      }

      if (checkForAnswerSubmission && isSubmitingAnswer) {
        // if answer submission is detected, don't speak the message
        return;
      }

      if (!window.heygenAvatar) {
        toast.error('Avatar API not initialized');
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const handleStopTalking = (e: any) => {
          console.log('Avatar stopped talking', e);
          // Clean up the event listener
          window.heygenAvatar?.off(
            StreamingEvents.AVATAR_STOP_TALKING,
            handleStopTalking,
          );
          resolve();
        };

        // Add the event listener
        window.heygenAvatar?.on(
          StreamingEvents.AVATAR_STOP_TALKING,
          handleStopTalking,
        );

        window.heygenAvatar
          ?.speak({
            text: message,
            taskType: TaskType.REPEAT,
            taskMode: TaskMode.SYNC,
          })
          .catch((e) => {
            // Clean up the event listener in case of error
            window.heygenAvatar?.off(
              StreamingEvents.AVATAR_STOP_TALKING,
              handleStopTalking,
            );
            toast.error("avatar couldn't speak");
            reject(e);
          });
      });
    },
    [isSubmitingAnswer],
  );

  const heygenEndSession = useCallback(async () => {
    if (!window.heygenAvatar) return;
    try {
      await window.heygenAvatar?.stopAvatar();
    } catch (error) {
      toast.error('Error ending session');
    }
  }, []);

  const heygenStartSession = useCallback(async () => {
    if (!window.heygenAvatar) return;
    await window.heygenAvatar?.startSession();
  }, []);

  const heygenInterrupt = useCallback(async () => {
    if (!window.heygenAvatar) return;
    try {
      await window.heygenAvatar?.interrupt();
      console.log('Interrupted hygen avatar');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
    }
  }, []);

  const heygenStartVoiceChat = useCallback(async () => {
    if (!window.heygenAvatar) return;
    await window.heygenAvatar?.startVoiceChat();
  }, []);

  const heygenCloseVoiceChat = useCallback(async () => {
    if (!window.heygenAvatar) return;
    window.heygenAvatar?.closeVoiceChat();
  }, []);

  const heygenStartUserListening = useCallback(async () => {
    if (!window.heygenAvatar) return;
    await window.heygenAvatar?.startListening();
  }, []);

  const heygenStopUserListening = useCallback(async () => {
    if (!window.heygenAvatar) return;
    await window.heygenAvatar?.stopListening();
  }, []);

  // TODO: implement in future if required
  // const [chatMode, setChatMode] = useState('text_mode');
  // const handleChangeChatMode = async (v: string) => {
  //   if (v === chatMode) {
  //     return;
  //   }
  //   if (v === 'text_mode') {
  //    await heygenCloseVoiceChat();
  //   } else {
  //    await heygenStartVoiceChat();
  //   }
  //   setChatMode(v);
  // };

  return {
    heygenSpeak,
    heygenEndSession,
    heygenStartSession,
    heygenInterrupt,
    heygenStartVoiceChat,
    heygenCloseVoiceChat,
    heygenStartUserListening,
    heygenStopUserListening,
  };
};

export default useHeygen;
