import React from 'react';

import Image from 'next/image';

import { useStore } from '@/app/store/store';
import { getCommands } from '@/constants/commands';
import { AvatarMode } from '@/lib/constants';

const VoiceCommands = () => {
  const avatar = useStore((state) => state.interview.avatar);
  const hasAvatar = avatar !== AvatarMode.NONE;
  const commands = getCommands(hasAvatar);

  return (
    <div className="rounded-xl">
      <div className="bg-[#D6D6D6] rounded-t-xl flex items-center justify-between flex-row">
        <div className="flex flex-col px-3.5 py-2">
          <h1 className="text-base tablet-lg:text-lg">Voice Commands</h1>
          <p className="text-xs text-black">
            Use these commands to interact with the system
          </p>
        </div>
      </div>
      <div className="p-3 border rounded-b-xl border-t-0 ">
        <ul className="flex flex-col gap-2">
          {commands.map((cmd, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Image src={cmd.src} alt="icon" width={20} height={20} />
              <span>{cmd.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceCommands;
