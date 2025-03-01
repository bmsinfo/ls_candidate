import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import moment from 'moment';
import { toast } from 'sonner';

import { patchSession } from '@/app/serverActions/interview';
import { useStore } from '@/app/store/store';
import { INTERVIEW_ROUTES } from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';

import useAvatar from './useAvatar';
import useRequiredData from './useRequiredData';

export const useStartInterviewSession = (
  onError: (error: string) => void,
  cleanup: () => void,
) => {
  const router = useRouter();
  const { avatarMode } = useAvatar();
  const { hasRequiredData } = useRequiredData();
  const interviewData = useStore((state) => state.interview);

  const startInterview = useCallback(async () => {
    try {
      if (!hasRequiredData) {
        throw new Error('Required data is missing');
      }

      const { session_uid, candidate_uid, job_posting_uid } = interviewData;

      if (!session_uid || !candidate_uid || !job_posting_uid) {
        throw new Error('Session data is incomplete');
      }

      const response = await patchSession({
        session_uid,
        session_started_at: moment.utc().format(),
      });

      if (isErrorResponse(response)) {
        // toast.error(response.message);
        throw new Error(response.message);
        // return;
      }
      const route = INTERVIEW_ROUTES[avatarMode];
      router.push(route);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      cleanup();
      onError(errorMessage);

      loggerAPI({
        event: 'sharescreen',
        status: 'error',
        reason: errorMessage,
      });

      toast.error('Failed to start interview session');
    }
  }, [hasRequiredData, interviewData, avatarMode, router, cleanup, onError]);

  return { startInterview };
};
