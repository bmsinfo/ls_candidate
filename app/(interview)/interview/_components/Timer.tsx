import React from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const CountdownerTimer = dynamic(() => import('./CountdownerTimer'), {
  ssr: false,
});

const Timer = ({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) => {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {variant === 'mobile' && (
        <Image
          src="/assets/icons/timerPrimary.svg"
          alt="timer"
          width={20}
          height={20}
        />
      )}

      <div
        className={cn(
          'flex items-center justify-center h-12 bg-primary px-4 rounded',
          {
            'bg-transparent p-0 h-fit rounded-none': variant === 'mobile',
          },
        )}>
        <CountdownerTimer variant={variant} />
      </div>

      {variant !== 'mobile' && (
        <div className="flex items-center gap-2 ">
          <Image
            src="/icons/bell_notification.svg"
            width={24}
            height={24}
            alt="Notification Bell"
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Timer);
