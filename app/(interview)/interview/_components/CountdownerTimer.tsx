'use client';

import React from 'react';

import Image from 'next/image';

import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

// When importing this component, use dynamic import in the parent component.
const CountdownerTimer = ({
  variant = 'desktop',
}: {
  variant?: 'desktop' | 'mobile';
}) => {
  const { minutes, seconds, isNegative } = useTimer();

  const formatTime = (minutes: number, seconds: number): string => {
    const sign = isNegative ? '-' : '';
    const absSeconds = Math.abs(seconds);
    const absMinutes = Math.abs(minutes);
    return `${sign} ${absMinutes.toString().padStart(2, '0')}:${absSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'bg-black h-6 px-4 rounded flex items-center justify-center mr-4',
          {
            'bg-accent-red': isNegative,
            'bg-transparent m-0 p-0': variant === 'mobile',
          },
        )}>
        <span
          className={cn('text-white font-medium font-14-16-600 min-w-12', {
            'text-black': variant === 'mobile',
          })}>
          {formatTime(minutes, seconds)}
        </span>
      </div>
      {variant === 'mobile' ? (
        <p className="font-medium font-14-16-600">Mins Left</p>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Image src="/icons/timer.svg" alt="timer" width={20} height={20} />
          <p className="text-white font-14-16-600 mt-1">
            {' '}
            {isNegative ? 'Time Over' : 'Minutes Left'}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(CountdownerTimer);
