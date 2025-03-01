import { useCallback } from 'react';

import moment from 'moment';
import { toast } from 'sonner';
import { z } from 'zod';

import { WebCamWrapperRef } from '@/app/(interview)/interview/_components/WebCamWrapper';
import {
  fetchNextQuestionByIdUntilGetQuestion,
  patchAnswer,
  patchSession,
} from '@/app/serverActions/interview';
import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import { fetchNextQuestionByIdUntilGetQuestionInterface } from '@/app/types/interview';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { submitAnswerrValidation } from '@/lib/validations';

import useAvatarsSpeech from './useAvatarsSpeech';
import { useSessionHandler } from './useSessionHandler';

interface SubmissionDependencies {
  webCamReference: React.RefObject<WebCamWrapperRef>;
  handleAvatarVisibility?: (visible: boolean) => void;
}

export const useAnswerSubmission = ({
  webCamReference,
  handleAvatarVisibility,
}: SubmissionDependencies) => {
  const { endSessionHandler } = useSessionHandler();
  const { speak, stopSpeech } = useAvatarsSpeech();
  const { isSubmitingAnswer, setSubmitingAnswer } = useUIStore(
    (state) => state,
  );
  const currentQuestion = useStore((state) => state.currentQuestion);
  const startCountDown = useStore((state) => state.startCountDown);
  const stopCountDown = useStore((state) => state.stopCountDown);
  const appQuestionIds = useStore((state) => state.appQuestionIds);
  const setAppQuestionIds = useStore((state) => state.setAppQuestionIds);
  const updateCurrentQuestion = useStore(
    (state) => state.updateCurrentQuestion,
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof submitAnswerrValidation>) => {
      console.log({ asnwervvvvv: values, isSubmitingAnswer });
      if (isSubmitingAnswer) return;
      console.log('^^^^^ next question is ', currentQuestion);
      if (!currentQuestion?.uid) {
        loggerAPI({
          event: 'patch_answer',
          message: 'missing data',
          reason: JSON.stringify({
            currentQuestion,
          }),
        });

        throw new Error('Failed to Submit Answer : Some data is missing');
      }

      await stopSpeech();
      const { answer } = values;
      // Trim the answer to remove leading and trailing whitespace
      const trimmedAnswer = answer?.trim();

      // Check if the trimmed answer is empty
      if (!trimmedAnswer) {
        await speak('your answer field is empty. please have some words in it');

        throw new Error('Failed to Submit Answer : Answer cannot be empty');
        // return; // Exit the function early
      }

      try {
        stopCountDown();
        setSubmitingAnswer(true);
        // TODO: will use in future if required
        // const screenshot = webCamReference.current?.getWebCamImage();
        // if (!screenshot) {
        //   //   toast.error('Error taking screenshot');
        //   throw new Error('Failed to Submit Answer : Error taking screenshot');
        //   //   return;
        // }

        // try patching the answer 3 times before giving up
        const patchResp = await patchAnswer({
          uid: currentQuestion?.uid as string,
          answer: trimmedAnswer,
        });

        console.log({ patchResp });
        if (isErrorResponse(patchResp)) {
          // TODO: we need to reset the answer box
          throw new Error(patchResp.message + '(PATCH)');
        }
        // TODO: if this is the last question, then we need to end the session
        const newQuestion = await fetchNextQuestionByIdUntilGetQuestion({
          questionIds: patchResp.followup_question_uid
            ? [patchResp.followup_question_uid, ...appQuestionIds]
            : appQuestionIds,
        });
        console.log({ newQuestion });

        if (isErrorResponse(newQuestion)) {
          handleAvatarVisibility?.(true);
          await endSessionHandler();
          // updateCurrentQuestion(null);
          return;
        }

        await speak('Your Answer submitted.');

        const { question, questionIds: question_ids } =
          newQuestion as fetchNextQuestionByIdUntilGetQuestionInterface;

        updateCurrentQuestion(question);
        setAppQuestionIds(question_ids as []);
        handleAvatarVisibility?.(true);
        // startCountDown();
      } catch (error) {
        console.error('Submit answer error:', error);
        toast.error(error + '');
        // alert(error + '');
        const newQuestionAfterPatchError =
          await fetchNextQuestionByIdUntilGetQuestion({
            questionIds: appQuestionIds,
          });
        console.log({ newQuestionAfterPatchError });
        if (isErrorResponse(newQuestionAfterPatchError)) {
          // if (newQuestionAfterPatchError.error) {
          // Trigger for below scenario
          // 1. if question_uids are empty
          // 2. if we don't have current question ids
          // updateCurrentQuestion(null);
          await endSessionHandler();
          return;
          // throw new Error(newQuestionAfterPatchError.message + '(FETCH)');
        }

        //upate the current question
        const { question, questionIds: question_ids } =
          newQuestionAfterPatchError as fetchNextQuestionByIdUntilGetQuestionInterface;

        updateCurrentQuestion(question);
        setAppQuestionIds(question_ids as []);

        throw error;
      } finally {
        startCountDown();
        setSubmitingAnswer(false);
      }
    },
    [currentQuestion, appQuestionIds, isSubmitingAnswer, setSubmitingAnswer],
  );

  return { onSubmit };
};
