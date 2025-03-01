'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import ClearSubmitButton from '@/app/(interview)/interview/_components/ClearSubmitButton';
import LabelWithToggler from '@/app/(interview)/interview/_components/LabelWithToggler';
import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useAvatarsSpeech from '@/hooks/useAvatarsSpeech';
import { ANSWER } from '@/lib/constants';
import { notify } from '@/lib/toastHelper';
import { cn, getErrorMessage } from '@/lib/utils';
import { submitAnswerrValidation } from '@/lib/validations';
import { useDeepgram } from '@/providers/DeepgramContextProvider';

import DeepgramToggler from './DeepgramToggler';

interface AnswerFormProps {
  onSubmit: (values: z.infer<typeof submitAnswerrValidation>) => Promise<void>;
  // onSubmit: (values: {
  //   answer: string;
  // }) => Promise<{ success: boolean; error: string | true } | undefined>;
}
const VOICE_CONFIG = { voice: 6, lang: 1, engine: 7 };

const KEYWORDS = {
  'repeat answer': 'repeatAnswerDispatchEvent',
  'repeat question': 'repeatQuestionDispatchEvent',
  'clear answer': 'clearAnswerDispatchEvent',
  'submit answer': 'submitAnswerDispatchEvent',
} as const;

type KeywordAction = keyof typeof KEYWORDS;
type EventName = (typeof KEYWORDS)[KeywordAction];

const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit }) => {
  const { deepgramText, resetDeepgramText } = useDeepgram();
  const isSubmitingAnswer = useUIStore((state) => state.isSubmitingAnswer);
  const isMobile = useUIStore((state) => state.isMobile);
  const currentQuestion = useStore((state) => state.currentQuestion);
  const { speak } = useAvatarsSpeech();
  const form = useForm<z.infer<typeof submitAnswerrValidation>>({
    resolver: zodResolver(submitAnswerrValidation),
    defaultValues: { [ANSWER]: '' },
  });

  const { getValues, setValue, setError, clearErrors, reset } = form;

  const updateLogMessage = (message: string, color = 'green') => {
    const logElement = document.getElementById('log-message-id');
    if (logElement)
      logElement.innerHTML = `<span style="color: ${color};">${message}</span>`;
  };

  const handleAction = useCallback(
    async (action: string, message: string, callback: () => void) => {
      updateLogMessage(`${action}...`);
      await speak(message);
      callback();
      updateLogMessage('');
    },
    [speak],
  );

  const repeatQuestion = useCallback(() => {
    const questionElement = document.getElementById('current-question');
    if (questionElement) {
      handleAction('Repeating the question', 'Ok', () => {
        speak(questionElement.textContent || '');
      });
    }
  }, [handleAction, speak]);

  const repeatAnswer = useCallback(() => {
    handleAction(
      'Repeating the answer',
      'Ok, I am Repeating Your Answer',
      () => {
        speak(getValues('answer'));
      },
    );
  }, [getValues, handleAction, speak]);

  const clearAnswer = useCallback(() => {
    handleAction('Clearing the answer', 'Ok', () => {
      setValue('answer', '');
      reset();
      speak('Your Answer is Cleared. Please Answer Again');
    });
  }, [handleAction, reset, setValue]);

  // trigger when say ' Submit answer' word
  const submitAnswer = useCallback(async () => {
    await resetDeepgramText();
    const answer = getValues('answer');

    if (!answer.trim()) {
      setError('answer', { type: 'required', message: 'Answer is required' });
      return;
    }

    try {
      const response = await onSubmit({ answer });
      // if (response?.error) {
      //   toast.error(response.error);
      //   return;
      // }
      setValue('answer', '');
      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        'Failed to submit answer. Please try again.',
      );
      setError('answer', {
        type: 'api',
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  }, [getValues, onSubmit, setValue, reset, setError, resetDeepgramText]);

  useEffect(() => {
    if (currentQuestion) {
      //  here we need to reset the answer box when getting the new question
      setValue('answer', '');
      reset();
    }
  }, [currentQuestion]);

  const actions: Record<EventName, () => void> = {
    repeatAnswerDispatchEvent: repeatAnswer,
    repeatQuestionDispatchEvent: repeatQuestion,
    clearAnswerDispatchEvent: clearAnswer,
    submitAnswerDispatchEvent: submitAnswer,
  };

  useEffect(() => {
    Object.values(KEYWORDS).forEach((event) => {
      window.addEventListener(event, actions[event]);
    });

    return () => {
      Object.values(KEYWORDS).forEach((event) => {
        window.removeEventListener(event, actions[event]);
      });
    };
  }, [repeatQuestion, repeatAnswer, clearAnswer, submitAnswer]);

  const processText = useCallback((text: string) => {
    return (Object.keys(KEYWORDS) as KeywordAction[]).reduce(
      (processedText, keyword) => {
        if (processedText.toLowerCase().includes(keyword)) {
          window.dispatchEvent(new Event(KEYWORDS[keyword]));
          return processedText.replace(new RegExp(keyword, 'ig'), '').trim();
        }
        return processedText;
      },
      text,
    );
  }, []);

  useEffect(() => {
    const prevValue = getValues('answer');
    const processedText = processText(deepgramText);
    setValue('answer', `${prevValue} ${processedText}`.trim());
  }, [deepgramText, getValues, setValue, processText]);

  const handleSubmit = async (values: { answer: string }) => {
    if (!values.answer.trim()) {
      setError('answer', { type: 'required', message: 'Answer is required' });
      return;
    }
    try {
      await onSubmit(values);
      setValue('answer', '');
      reset();
    } catch (error) {
      console.error('Error submitting answer:', error);

      const errorMessage = getErrorMessage(
        error,
        'Failed to submit answer. Please try again.',
      );
      setError('answer', {
        type: 'api',
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const processedText = processText(newValue);
    setValue('answer', processedText);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <LabelWithToggler variant={isMobile ? 'mobile' : 'desktop'} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="h-full w-full flex-1 flex flex-col space-y-6">
          <FormField
            control={form.control}
            name={ANSWER}
            disabled={isSubmitingAnswer}
            render={({ field, fieldState: { error } }) => (
              <FormItem
                id="tour-guide-answer-box"
                className="flex-1 bg-[#F2FBFF] rounded-2xl">
                <FormControl>
                  <Textarea
                    placeholder="Enter your answer here"
                    className="resize-none h-full text-md p-2 remove-scrollbar"
                    {...field}
                    id="answer-textarea-id"
                    onChange={(e) => {
                      // TODO: need to remove this if working fine
                      // if (error) clearErrors('answer');
                      handleTextareaChange(e);
                    }}
                    onCopy={(e) => {
                      notify({ type: 'error', message: 'Copy is not allowed' });
                      e.preventDefault();
                    }}
                    onPaste={(e) => {
                      notify({
                        type: 'error',
                        message: 'Paste is not allowed',
                      });
                      e.preventDefault();
                    }}
                  />
                </FormControl>
                <p
                  id="log-message-id"
                  className={cn('text-[0.7rem] font-normal text-destructive')}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {isMobile && <DeepgramToggler classNames="md:hidden justify-end" />}

          <ClearSubmitButton
            isSubmiting={isSubmitingAnswer}
            clearHandler={() => reset()}
          />
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
