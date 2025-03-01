import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useStore } from '@/app/store/store';
import { useUtilStore } from '@/app/store/util-store';
import {
  ALL_WEB,
  ONLY_INTERVIEW_WEB,
  PRE_SCREENING_IN_PROGRESS,
  WA_WEB,
} from '@/lib/constants';
import { loggerAPI } from '@/lib/logger';

export const useTermsNavigation = () => {
  const isMobile = useUtilStore((state) => state.isMobile);

  const { push } = useRouter();
  const interviewState = useStore((state) => state.interview);
  const markJobDesciptionPageAsVisited = useStore(
    (state) => state.markJobDesciptionPageAsVisited,
  );

  const validateInterviewData = useCallback((): boolean => {
    const { session_uid, candidate_uid, question_uids } = interviewState;

    if (!session_uid || !candidate_uid || !question_uids) {
      toast.error('Required data is missing to initiate the interview');
      loggerAPI({
        event: 'job_description',
        message: 'Required data is missing to initiate the interview',
        reason: 'missing data',
        data: { session_uid, candidate_uid, question_uids },
      });
      return false;
    }
    return true;
  }, [interviewState]);

  const handleNavigation = useCallback(async () => {
    if (!validateInterviewData()) return;

    try {
      markJobDesciptionPageAsVisited();

      const { interview_status, flow_type, prescreening_status } =
        interviewState;

      const isPrescreening = prescreening_status === PRE_SCREENING_IN_PROGRESS;

      // const shouldSkipFitment =
      //   interview_status === FITMENT_PASSED ||
      //   !should_ask_fitment_questions ||
      //   fitment_questions?.length === 0;
      const basePath = isPrescreening ? '/add-profile' : '/permissions';

      const fallbackPath = '/permissions';

      push([ALL_WEB].includes(flow_type as string) ? basePath : fallbackPath);

      loggerAPI({
        event: 'job_description',
        message: 'Terms and conditions accepted & continued',
        reason: 'success',
        data: '',
      });
    } catch (error) {
      toast.error(`Failed to initiate the session: ${error}`);
    }
  }, [interviewState, markJobDesciptionPageAsVisited, push]);

  return { handleNavigation };
};
