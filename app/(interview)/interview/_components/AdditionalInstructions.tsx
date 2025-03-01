import React from 'react';

import { CircleHelp, Maximize2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type Command = {
  text: React.ReactNode | string;
  icon?: React.ReactElement;
};

const AdditionalInstructions = ({ hideHeader }: { hideHeader?: boolean }) => {
  const commands: Command[] = [
    {
      text: <span> Speak clearly and at a moderate pace.</span>,
    },
    {
      text: (
        <span>
          Wait for the system to process your command before speaking again.
        </span>
      ),
    },
    {
      text: (
        <span className="flex items-center">
          If you&apos;re unsure, click ? icon, for assistance.
        </span>
      ),
      icon: <CircleHelp className="text-primary mx-2" />,
    },
    {
      text: (
        <span>
          {' '}
          Remember to submit your answer when you&apos;re dones peaking.
        </span>
      ),
    },
    {
      text: (
        <span>
          {' '}
          You can Maximize the answer box by clicking on the Maximize icon.
        </span>
      ),
      icon: <Maximize2 size={20} className="border rounded p-1" />,
    },
    {
      text: (
        <span>
          {' '}
          Make sure your internet connection is stable and not interrupted.
        </span>
      ),
    },
    {
      text: (
        <span>
          {' '}
          While giving the interiview please stick infront of webcam.
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-xl">
      {!hideHeader && (
        <div className="bg-[#D6D6D6] rounded-t-xl flex items-center justify-between flex-row">
          <div className="flex flex-col px-3.5 py-2">
            <h1 className="text-base tablet-lg:text-lg">
              Additional Instructions
            </h1>
            <p className="text-xs text-black">
              Follow these guidelines to ensure a smooth interview.
            </p>
          </div>
        </div>
      )}
      <div
        className={cn('p-3 border rounded-b-xl border-t-0 ', {
          'px-3 py-0 border-none': hideHeader,
        })}>
        <ul className="flex flex-col gap-2">
          {commands.map((cmd, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              {/* <Image src={cmd.src} alt="icon" width={20} height={20} /> */}
              <span
                className={cn('flex items-center gap-2', {
                  'items-start': hideHeader,
                })}>
                {index + 1}. {cmd.text}
                {cmd.icon && <span className="ml-2">{cmd.icon}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdditionalInstructions;
