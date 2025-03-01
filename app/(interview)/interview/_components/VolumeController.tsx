'use client';

import { useState } from 'react';

import Image from 'next/image';

import * as Slider from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

export default function VolumeControl({ classNames }: { classNames?: string }) {
  const [volume, setVolume] = useState(7);

  const handleVolumeChange = (newVolume: number[]) => {
    console.log({ newVolume });
    setVolume(newVolume[0]);

    if (typeof (window as any)?.setPlayerVolume === 'function') {
      (window as any).setPlayerVolume(newVolume);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center  h-36 w-12 bg-[#DBDBDB]  rounded-3xl py-5',
        classNames,
      )}>
      <Slider.Root
        className="relative flex items-center justify-center w-2 h-32 my-2"
        defaultValue={[7]}
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={10}
        step={1}
        orientation="vertical"
        aria-label="Volume">
        <Slider.Track className="relative h-full w-[2px] bg-background w- rounded-full">
          <Slider.Range className="absolute w-[4px] -left-[1px] bg-blue-500 rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="block size-14px bg-grayscale-dark rounded-full shadow focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75" />
      </Slider.Root>
      <Image src="/icons/volume-high.svg" alt="volume" width={24} height={24} />
    </div>
  );
}
