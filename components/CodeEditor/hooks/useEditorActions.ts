import { useCallback } from 'react';

import { toast } from 'sonner';

import useAvatarsSpeech from '@/hooks/useAvatarsSpeech';

import { type CodeEditorRef } from '../types';
import { useLogger } from './useLogger';

export const useEditorActions = (
  codeEditorRef: React.RefObject<CodeEditorRef>,
  codingAnswerRef: React.MutableRefObject<string>,
  onSubmit: (values: { answer: string }) => Promise<void>,
  resetDeepgramText: () => Promise<void>,
) => {
  const { speak } = useAvatarsSpeech();
  const { updateLogMessage } = useLogger();

  const handleAction = useCallback(
    async (action: string, message: string, callback: () => Promise<void>) => {
      try {
        updateLogMessage(`${action}...`);
        await speak(message);
        await callback();
        updateLogMessage('');
      } catch (error) {
        toast.error(error + '');
      }
    },
    [speak, updateLogMessage],
  );

  const repeatQuestion = useCallback(async () => {
    const questionElement = document.getElementById('current-question');
    if (questionElement) {
      await handleAction(
        'Repeating the question',
        'Ok',
        async () => await speak(questionElement.textContent || ''),
      );
      console.log('### deepgram text reset after repeat question #######');
      resetDeepgramText();
    }
  }, [handleAction, speak]);

  const clearAnswer = useCallback(() => {
    handleAction('Clearing the answer', 'Ok', async () => {
      codeEditorRef.current?.resetCode();
      codingAnswerRef.current = '';
      speak('Your Answer is Cleared. Please Answer Again');
    });
  }, [handleAction, speak, codeEditorRef, codingAnswerRef]);

  const submitAnswer = useCallback(async () => {
    await resetDeepgramText();

    try {
      if (!codingAnswerRef.current) {
        throw new Error('Answer is required');
      }
      await onSubmit({ answer: codingAnswerRef.current });
      codeEditorRef.current?.resetCode();
      codingAnswerRef.current = '';
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }, [onSubmit, codeEditorRef, codingAnswerRef, resetDeepgramText]);

  return {
    repeatQuestion,
    clearAnswer,
    submitAnswer,
  };
};
