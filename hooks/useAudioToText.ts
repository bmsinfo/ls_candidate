import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePermission } from 'react-use';

import { useStore } from '@/app/store/store';
import { CustomEventInterface } from '@/app/types/interview';
import { useToast } from '@/components/ui/use-toast';

type AudioRecorder = {
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
  clearError: () => void;
  isRecording: boolean;
};

const triggerCustomEvent = (eventName: string, detail: object) => {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
};

const useAudioToText = (
  updateTranscript: (transcript: string) => void,
): AudioRecorder => {
  const { toast } = useToast();
  const isLoading = useStore((state) => state.isLoading);
  const toggleLoadingState = useStore((state) => state.updateLoadingState);
  const setErrorInSpeechToText = useStore(
    (state) => state.setErrorInSpeechToText,
  );
  const updateSpeechToText = useStore(
    (state) => state.updateSpeechToTextStatus,
  );
  // TODO: need to make use of this based on subscription plan
  // const shouldEnableSpeechToText = useStore(
  //   (state) => state.interview?.subscription_plan_details?.speech_to_text
  // );

  const shouldEnableSpeechToText = true;
  //   const dispatch = useAppDispatch();
  //   const { logEvent, logException } = useAppInsights();

  const [error, setError] = useState<string | null>(null);
  let mediaStream: MediaStream | null = null;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const isMicroPhoneActive = usePermission({ name: 'microphone' });

  console.log({ microphonePermissions: isMicroPhoneActive });

  const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

  // console.log("### api key NEXT_PUBLIC_DEEPGRAM_API_KEY ####", API_KEY);

  const clearError = () => {
    setError(null);
  };

  const startRecording = async () => {
    // TODO : if this 'speech_to_text' feature is disable then return no need to use mediastream or socket
    if (!shouldEnableSpeechToText) {
      return;
    }
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current?.state === 'recording'
      ) {
        console.log(
          '### microphone already active no need to start again ####',
        );
        return;
      }

      if (!navigator.mediaDevices) {
        console.error('navigator.mediaDevices is not available');
        // logException({
        //   error: "microphone-permission",
        //   properties: {
        //     error_msg: "navigator.mediaDevices is not available.",
        //     microphone_permission: "not granted",
        //   },
        // });
        return;
      }

      mediaStream = await navigator?.mediaDevices?.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = mediaStream;

      // TODO: comment this out for now (safari browser)
      // if (!MediaRecorder.isTypeSupported("audio/webm")) {
      //   return alert("Browser not supported");
      // }

      // mediaRecorderRef.current = new MediaRecorder(mediaStream, {
      //   mimeType: "audio/webm",
      // });

      mediaRecorderRef.current = new MediaRecorder(mediaStream);

      socketRef.current = new WebSocket(
        'wss://api.deepgram.com/v1/listen?model=nova-2',
        [
          'token',
          API_KEY as string, // Replace 'YOUR_KEY_HERE' with your actual Deepgram API key
        ],
      );

      socketRef.current.onopen = () => {
        console.log('Connected');
        triggerCustomEvent('deepgram', {
          connection: 'CONNECTED',
        });
        mediaRecorderRef.current?.addEventListener(
          'dataavailable',
          async (event) => {
            if (
              event.data.size > 0 &&
              socketRef.current?.readyState === WebSocket.OPEN
            ) {
              socketRef.current?.send(event.data);
            }
          },
        );

        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current?.state !== 'recording'
        ) {
          mediaRecorderRef.current?.start(1000);
          //   logEvent({
          //     name: "start-caturing-candidate-voice",
          //   });
        }
        toggleLoadingState(false); // close the loader
      };

      socketRef.current.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received?.channel?.alternatives?.[0]?.transcript;
        if (transcript && received.is_final) {
          console.log(transcript);
          // Handle transcript data here if needed
          updateTranscript(transcript);
        }
      };

      socketRef.current.onclose = () => {
        console.log('Connection closed');

        triggerCustomEvent('deepgram', {
          connection: 'CLOSED',
        });
        // TODO : here need to mediaRecorderRef.current to null
        mediaRecorderRef.current = null;
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        // TODO: here need to capture the error
        setErrorInSpeechToText();
        // need to disable the 'speech-to-text-feature' when got error here
        updateSpeechToText(false);

        toast({
          title: 'Error in Speech to text (functionality)',
          variant: 'destructive',
        });
      };
    } catch (error) {
      console.error('Error accessing microphone custom:', error);
      setError('Error accessing microphone');

      //   logException({
      //     error: "microphone-permission",
      //     properties: {
      //       error_msg: "Error accessing microphone",
      //       microphone_permission: "not granted",
      //     },
      //   });
    }
  };

  console.log({ mediaRecorderRef });
  console.log({ mediaStream });

  const stopRecording = () => {
    console.log('### stop recording ###', {
      currentState: mediaRecorderRef.current?.state,
    });

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current?.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks()?.forEach((track) => track.stop());
      socketRef.current?.close();

      //   logEvent({
      //     name: "stop-caturing-candidate-voice",
      //   });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current?.pause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current?.resume();
    }
  };
  useEffect(() => {
    const handleAvatarSpeaking = (event: CustomEventInterface) => {
      const isAvatarSpeaking = event?.detail?.isAvatarSpeaking;
      if (isAvatarSpeaking === 'SPEAKING') {
        console.log('### pausing the audio strem ####', { isAvatarSpeaking });
        pauseRecording();
      } else {
        console.log('### resuming the audio strem ####', { isAvatarSpeaking });

        resumeRecording();
      }
    };

    window.addEventListener('isAvatarSpeaking', handleAvatarSpeaking);
  }, []);

  useEffect(() => {
    // return () => {
    //     stopRecording();   TODO:implement in futrue
    // };
  }, []); // Cleanup when component unmounts

  return {
    startRecording,
    stopRecording,
    isRecording:
      mediaRecorderRef?.current?.state === 'recording' ? true : false,
    error,
    clearError,
  };
};

export default useAudioToText;
