'use client';

import React from 'react';

import { AudioLines } from 'lucide-react';

import { useStore } from '@/app/store/store';
import { useLogger } from '@/components/CodeEditor/hooks/useLogger';
import IconWrapper from '@/components/IconWrapper';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAvatarsSpeech from '@/hooks/useAvatarsSpeech';
import { AvatarMode } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface QuestionCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  width: number;
  height: number;
}

const QuestionCardIcon = React.forwardRef<
  HTMLDivElement,
  QuestionCardIconProps
>(({ className, icon, width, height, ...props }, ref) => (
  <div className="flex items-center justify-center" ref={ref} {...props}>
    <IconWrapper
      iconSrc={icon}
      width={width}
      height={height}
      className={cn(className)}
    />
  </div>
));
QuestionCardIcon.displayName = 'QuestionCardIcon';

const QuestionWrapper = ({
  variant = 'desktop',
}: {
  variant?: 'desktop' | 'mobile';
}) => {
  const { currentQuestion } = useStore((state) => state);
  const { avatar } = useStore((state) => state.interview);

  const { speak } = useAvatarsSpeech();
  const { updateLogMessage } = useLogger();
  return (
    <div
      className={cn('space-y-2 h-full w-full flex flex-col', {
        'flex items-center flex-col px-4 py-2  rounded-[6px] h-fit  bg-primary-dodger-light':
          variant === 'mobile',
      })}>
      <div className={cn('flex w-full items-center justify-between')}>
        <div className="flex gap-2">
          {variant === 'mobile' && <AudioLines className="text-primary" />}
          <h1
            className={cn(
              'text-base text-black 2xl:text-lg short-md:text-sm font-medium',
              {
                'text-primary': variant === 'mobile',
              },
            )}>
            Question
          </h1>
        </div>

        <div className={cn('flex items-center justify-center gap-6 ')}>
          <QuestionCardIcon icon="/icons/help.svg" width={14} height={14} />

          {avatar !== AvatarMode.NONE && (
            <QuestionCardIcon
              onClick={async () => {
                updateLogMessage('Repeating the question');
                await speak(currentQuestion?.question as string, true);
                updateLogMessage('');
              }}
              icon="/icons/reload.svg"
              width={14}
              height={14}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          'flex items-center justify-between border p-4 rounded-[6px] h-[70%] w-full bg-background',
          {
            'bg-primary-dodger-light rounded-none border-none p-0':
              variant === 'mobile',
          },
        )}>
        <ScrollArea className=" h-full w-full  cursor-all-scroll flex items-center justify-center">
          <p id="current-question">{currentQuestion?.question}</p>
        </ScrollArea>
      </div>
    </div>
  );
};

export default QuestionWrapper;
