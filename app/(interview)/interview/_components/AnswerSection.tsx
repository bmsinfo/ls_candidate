import React, { useCallback, useEffect } from 'react';

import { useStore } from '@/app/store/store';
import CustomCodeEditor from '@/components/CodeEditor/CustomCodeEditor';
import { useAnswerSubmission } from '@/hooks/useAnswerSubmission';
import useAvatarsSpeech from '@/hooks/useAvatarsSpeech';
import { QUESTION_TYPE_CODING } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { DeepgramContextProvider } from '@/providers/DeepgramContextProvider';

import AnswerForm from './AnswerForm';
import { WebCamWrapperRef } from './WebCamWrapper';

interface AnswerSectionProps {
  isAvatarVisible?: boolean;
  webCamReference: React.RefObject<WebCamWrapperRef>;
  handleAvatarVisibility?: (visible: boolean) => void;
  isFirstQuestionAskedByAvatar?: boolean;
}

const AnswerSection: React.FC<AnswerSectionProps> = ({
  isAvatarVisible,
  webCamReference,
  isFirstQuestionAskedByAvatar,
  handleAvatarVisibility,
}) => {
  const currentQuestion = useStore((state) => state.currentQuestion);
  const { speak } = useAvatarsSpeech();
  const { onSubmit } = useAnswerSubmission({
    webCamReference,
    handleAvatarVisibility,
  });

  const askAvatarToSpeakQuestion = useCallback(async () => {
    if (currentQuestion?.question) {
      await speak(currentQuestion?.question);
      console.log('Question asked by avatar ------>>>>>>>>>', {
        question: currentQuestion.question,
      });
      handleAvatarVisibility?.(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    isFirstQuestionAskedByAvatar && askAvatarToSpeakQuestion();
  }, [currentQuestion]);

  const isCodingQuestion =
    currentQuestion?.question_type === QUESTION_TYPE_CODING;

  return (
    <DeepgramContextProvider>
      <div
        className={cn(
          'h-full flex flex-col transition-all duration-700 ease-linear justify-center text-foreground gap-2',
          {
            hidden: isAvatarVisible,
          },
        )}>
        {isCodingQuestion ? (
          <CustomCodeEditor onSubmit={onSubmit} />
        ) : (
          <AnswerForm onSubmit={onSubmit} />
        )}
      </div>
    </DeepgramContextProvider>
  );
};

export default AnswerSection;
