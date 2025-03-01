'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Mic, MicOff } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from '@/providers/DeepgramContextProvider';
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from '@/providers/MicrophoneContextProvider';

const TestDeepgramToggler = () => {
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  const [deepgramVoiceToTextResponse, setDeepgramVoiceToTextResponse] =
    useState('');
  const {
    connection,
    connectToDeepgram,
    disconnectFromDeepgram,
    deepgramConnectionState,
  } = useDeepgram();
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();

  const isDeepgramListening =
    deepgramConnectionState === 1 && microphoneState === 3;

  const handleDeepgramDisconnection = async () => {
    console.log('#### deepgram handle disconnection ###');
    stopMicrophone();
    disconnectFromDeepgram();
  };

  const handleDeepgramConnection = async () => {
    console.log('#### deepgram handle connection ###');
    await setupMicrophone();
    // await startMicrophone();
    await connectToDeepgram();
  };

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      console.log('thisCaption', thisCaption);
      if (thisCaption !== '') {
        console.log('thisCaption !== ""', thisCaption, {
          isFinal,
          speechFinal,
        });

        setDeepgramVoiceToTextResponse((prev) => prev + ' ' + thisCaption);
      }
    };

    if (deepgramConnectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepgramConnectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      deepgramConnectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, deepgramConnectionState]);

  return (
    <div>
      <div
        id="tour-guide-listening"
        className={cn('flex items-center space-x-2 ', {})}
      >
        <span className="text-sm font-medium">
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
        {isDeepgramListening ? (
          <Mic className="w-5 h-5 text-green-500" />
        ) : (
          <MicOff className=" w-5 h-5" />
        )}
      </div>
      <p>transcript : {deepgramVoiceToTextResponse}</p>
    </div>
  );
};

export default TestDeepgramToggler;
