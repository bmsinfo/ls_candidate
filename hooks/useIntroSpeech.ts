import { useCallback } from 'react';

import { useStore } from '@/app/store/store';
import { loggerAPI } from '@/lib/logger';

const INTERVIEW_TIPS_1 =
  'Before starting Interview let me help you with few Interview Tips.';
const INTERVIEW_TIPS_2 =
  'Number 1, if you have not answered question and want to listen question, you can say Repeate Question.';
const INTERVIEW_TIPS_3 =
  'Number 2, if you want to check the answer by listening, then you can say repeat my answer or repeat answer.';
const INTERVIEW_TIPS_4 =
  'Number 3 you can say clear answer, which will clear answer and then you can answer again and Finally to submit the Answer you can say Submit Answer or submit.';
const LETS_START = 'Lets start with interview. Here is your First Question.';
const useIntroSpeech = () => {
  const candidate_first_name = useStore(
    (state) => state.interview?.candidate_full_name,
  );
  const isResuming = useStore((state) => state.interview?.isResumingInterview);
  const currentQuestion = useStore((state) => state.currentQuestion);
  const questionIds = useStore((state) => state.interview.question_uids);
  const updateResumingStatus = useStore(
    (state) => state.updateResumingStatusStatus,
  );
  const appQuestionIds = useStore((state) => state.appQuestionIds);
  const startCountDown = useStore((state) => state.startCountDown);

  const handleNewSession = useCallback(
    async (speak: (message: string) => Promise<void>): Promise<void> => {
      const introMessage = `Welcome ${candidate_first_name}, My name is Vishal, Hope you are doing well!`;
      await speak(introMessage);
      await speak(INTERVIEW_TIPS_1);
      await speak(INTERVIEW_TIPS_2);
      await speak(INTERVIEW_TIPS_3);
      await speak(INTERVIEW_TIPS_4);
      await speak(LETS_START);
      return Promise.resolve();
    },
    [candidate_first_name],
  );

  const handleResumingSession = useCallback(
    async (speak: (message: string) => Promise<void>): Promise<void> => {
      loggerAPI({
        event: 'session_resume',
        message: 'Session resume',
      });
      updateResumingStatus(true);
      const resumingMessage = `welcome back ${candidate_first_name}, I have already asked you questions. I will resume the interview. Good luck!`;
      await speak(resumingMessage);
      return Promise.resolve();
    },
    [candidate_first_name],
  );

  const playIntroSpeech = useCallback(
    async (speak: (message: string) => Promise<void>): Promise<void> => {
      // add 1 to questionIds because we have already asked the first question
      if (!isResuming && questionIds.length === appQuestionIds.length + 1) {
        await handleNewSession(speak);
      } else {
        await handleResumingSession(speak);
      }

      await Promise.resolve(); // wait for any pending promises to resolve
      window.dispatchEvent(new Event('tipsCompleted'));
      await speak(currentQuestion?.question as string);
    },
    [
      isResuming,
      questionIds,
      appQuestionIds,
      candidate_first_name,
      currentQuestion,
      loggerAPI,
      updateResumingStatus,
    ],
  );

  const handleIntroCompletion = useCallback(() => {
    console.log('#### intro message completed #####');
    startCountDown();
    // dispatch event that first question is asked by avatar

    window.dispatchEvent(new Event('firstQuestionAsked'));
    window.dispatchEvent(new Event('handleAvatar'));
    loggerAPI({
      message: 'avatar loaded & intro message completed',
      status: 'success',
      event: 'avatar',
    });
  }, []);

  return { playIntroSpeech, handleIntroCompletion };
};

export default useIntroSpeech;
