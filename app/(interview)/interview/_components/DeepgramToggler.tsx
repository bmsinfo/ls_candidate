import React from 'react';

import Image from 'next/image';

import { Mic, MicOff } from 'lucide-react';

import { useStore } from '@/app/store/store';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useDeepgram } from '@/providers/DeepgramContextProvider';

const DeepgramToggler = ({ classNames }: { classNames?: string }) => {
  const { handleDeepgramConnection, handleDeepgramDisconnection } =
    useDeepgram();

  const isDeepgramListening = useStore((state) => state.isDeegramListening);
  // const isSpeechToTextEnabled = useStore(
  //   (state) => state.interview.subscription_plan_details.speech_to_text,
  // );
  console.log(' Deepgram toogler component ----');

  return (
    <div
      className={cn(
        'flex items-center space-x-4  ',
        {
          // hidden: !isSpeechToTextEnabled,
        },
        classNames,
      )}>
      <span className="text-xs  italic">
        {isDeepgramListening
          ? 'Listening to your answer...'
          : 'Enable voice to text'}
      </span>
      <Switch
        checked={isDeepgramListening}
        onClick={() => {
          isDeepgramListening
            ? handleDeepgramDisconnection()
            : handleDeepgramConnection();
        }}
        className="data-[state=checked]:bg-green-500"
      />
      <div
        className={`mr-10 rounded-full p-[8px] ${isDeepgramListening ? 'bg-primary' : 'bg-stone-300'}`}>
        <Mic
          size={16}
          className={`${isDeepgramListening ? 'text-white' : ''}`}
        />
      </div>
    </div>
  );
};

export default React.memo(DeepgramToggler);
