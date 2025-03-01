import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import moment from 'moment';

import { patchSession } from '@/app/serverActions/interview';
import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import useVisibilityTracking from '@/hooks/useVisibilityTracking';
import { loggerAPI } from '@/lib/logger';

import useAvatarsSpeech from './useAvatarsSpeech';

export const useSessionHandler = () => {
  const router = useRouter();
  const setSessionEnded = useUIStore((state) => state.setSessionEnded);
  const { speak } = useAvatarsSpeech();
  const getVisibilityData = useVisibilityTracking();
  const { candidate_uid, session_uid, job_posting_uid } = useStore(
    (state) => state.interview,
  );

  const endSessionHandler = useCallback(async () => {
    try {
      if (!candidate_uid || !job_posting_uid || !session_uid) {
        const errorMessage =
          'Failed to end session : missing session id, candidate id, jobposting id';

        throw new Error(errorMessage);
      }

      await speak('Your Answer submitted.');
      const visibilityData = getVisibilityData();
      const { timeSpentOutsideCurrentTab, noTimeUserLeaveCurrentTab } =
        visibilityData;

      await patchSession({
        session_uid,
        session_ended_at: moment.utc().format(),
        last_submitted_at: moment.utc().format(),
        cheating_monitoring_details: {
          timeSpentOutsideCurrentTab: timeSpentOutsideCurrentTab?.toFixed(2),
          noTimeUserLeaveCurrentTab,
        },
      });

      loggerAPI({
        event: 'end_session',
        message: 'Session ended',
        reason: 'success',
        data: {
          timeSpentOutsideCurrentTab: timeSpentOutsideCurrentTab?.toFixed(2),
          noTimeUserLeaveCurrentTab,
        },
      });
      setSessionEnded(true);

      const thanksMessage =
        'Thank you for giving the Interview. Recruitment Team will reach out to you for next process depending upon your Interview status';
      await speak(thanksMessage);

      router.push('/finish');
    } catch (error) {
      throw error;
    }
  }, [session_uid, candidate_uid, job_posting_uid, router, getVisibilityData]);

  return { endSessionHandler };
};
