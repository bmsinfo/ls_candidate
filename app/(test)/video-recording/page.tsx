'use client';

import React, { useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import { Monitor } from 'lucide-react';

import { VideoWrapperRef } from '@/components/VideoWrapper';
import { Button } from '@/components/ui/button';
import { DeepgramContextProvider } from '@/providers/DeepgramContextProvider';
import { useMediaPermission } from '@/providers/MediaProvider';
import { useSocketProvider } from '@/providers/SocketProvider';

import TestAvatar from './_components/TestAvatar';
import TestDeepgramToggler from './_components/TestDeepgramToggler';
import VideoRecorder from './_components/VideoRecorder';

const VideoRecording = () => {
  const videoWrapperRef = useRef<VideoWrapperRef>(null);
  const [candidateSelfie, setCandidateSelfie] = useState<string>();
  const { webcamStream, setErrorMessage, startScreenShare } =
    useMediaPermission();
  const { connectSocket } = useSocketProvider();

  const handleCapture = useCallback(() => {
    if (webcamStream?.active) {
      const selfie = videoWrapperRef.current?.getSelfie();
      setCandidateSelfie(selfie as string);
    } else {
      const errorMsg =
        'Webcam stream not found. Please refresh the page and try again';
      setErrorMessage(errorMsg);
    }
  }, [videoWrapperRef.current, webcamStream]);

  return (
    <div className="flex flex-col space-y-4">
      <Button disabled onClick={handleCapture}>
        Capture
      </Button>
      <Button
        disabled
        onClick={startScreenShare}
        className="w-full bg-black text-white">
        <Monitor className="mr-2 h-4 w-4" /> Share Entire Screen
      </Button>

      {/* <Button onClick={shareScreen} className="w-full bg-black text-white">
        Share Screen
      </Button> */}

      <Button onClick={connectSocket} className="w-full bg-black text-white">
        Connect socket
      </Button>
      {candidateSelfie && (
        <Image
          src={candidateSelfie}
          className=" rounded-2xl size-96 object-contain"
          alt="canidate-selfie "
          width={200}
          height={300}
        />
      )}
      <DeepgramContextProvider>
        <TestDeepgramToggler />
      </DeepgramContextProvider>

      <TestAvatar />
      <VideoRecorder />
    </div>
  );
};

export default VideoRecording;
