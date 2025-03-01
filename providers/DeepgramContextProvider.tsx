'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import {
  createClient,
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from '@deepgram/sdk';

import { useStore } from '@/app/store/store';
import { useUIStore } from '@/app/store/ui-store';
import { CustomEventInterface } from '@/app/types/interview';
import { loggerAPI } from '@/lib/logger';
import { isOnLine } from '@/lib/utils';

import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from './MicrophoneContextProvider';

interface DeepgramContextType {
  connection: LiveClient | null;
  connectToDeepgram: (options?: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  deepgramConnectionState: LiveConnectionState;
  handleDeepgramConnection: () => Promise<void>;
  handleDeepgramDisconnection: () => void;
  deepgramText: string;
  resetDeepgramText: () => Promise<void>;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(
  undefined,
);

interface DeepgramContextProviderProps {
  children: ReactNode;
}

let shouldStartCapturingContentFromDeepgram = false;

const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();
  const isSubmitingAnswer = useUIStore((state) => state.isSubmitingAnswer);
  const setDeegramListening = useStore((state) => state.setDeegramListening);
  const hasAvatar = useStore((state) => state.interview.avatar);
  const effectDeeperRun = useRef(false);
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [deepgramText, setDeepgramText] = useState('');

  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  /**
   * deepgramConnectionState is used to manage the state of the connection.
   *
   * 3: The connection is closed.
   * 1: The connection is open.
   *
   */
  const [deepgramConnectionState, setConnectionState] =
    useState<LiveConnectionState>(LiveConnectionState.CLOSED);

  /**
   * Connects to the Deepgram speech recognition service and sets up a live transcription session.
   *
   * @param options - The configuration options for the live transcription session.
   * @param endpoint - The optional endpoint URL for the Deepgram service.
   * @returns A Promise that resolves when the connection is established.
   */
  const connectToDeepgram = async (options?: LiveSchema, endpoint?: string) => {
    const deepgram = createClient(API_KEY);

    const conn = deepgram.listen.live(
      {
        model: 'nova-2',
        punctuate: true,
        ...options,
      },
      endpoint,
    );

    conn.addListener(LiveTranscriptionEvents.Open, () => {
      setConnectionState(LiveConnectionState.OPEN);
      console.log('### deepgram connected ###');
      loggerAPI({
        event: 'deepgram',
        message: 'Deepgram connected',
        status: 'success',
      });
    });

    conn.addListener(LiveTranscriptionEvents.Close, () => {
      setConnectionState(LiveConnectionState.CLOSED);
      console.log('### deepgram disconnected ###');

      if (isOnLine()) {
        loggerAPI({
          event: 'deepgram',
          message: 'Deepgram disconnected',
          status: 'success',
        });
      }
    });

    setConnection(conn);
  };

  const disconnectFromDeepgram = async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
    }
  };

  const handleDeepgramDisconnection = useCallback(async () => {
    console.log('#### deepgram handle disconnection ###');
    await stopMicrophone();
    await disconnectFromDeepgram();
  }, [stopMicrophone, disconnectFromDeepgram]);

  const handleDeepgramConnection = useCallback(async () => {
    console.log('#### deepgram handle connection ###');
    await setupMicrophone();
    await connectToDeepgram();
  }, [setupMicrophone, connectToDeepgram]);

  const resetDeepgramText = useCallback(async () => {
    setDeepgramText('');
  }, [setDeepgramText]);

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready && !effectDeeperRun.current) {
      effectDeeperRun.current = true;
      console.log(' ### deep once 00000000000------');
      connectToDeepgram();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        const isAvatarSpeaking = (window as any).isAvatarSpeaking;
        if (!isAvatarSpeaking) {
          // console.log('### deepgram sending data ###', e.data);
          connection?.send(e.data);
        } else {
          console.log('### avatar is deepgram sending data ####', e.data);
        }
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      // console.log('thisCaption', thisCaption, { isSubmitingAnswer });
      if (thisCaption !== '') {
        console.log('thisCaption !== ""', thisCaption, {
          isFinal,
          speechFinal,
        });
        const isAvatarSpeaking = (window as any).isAvatarSpeaking;
        console.log({
          shouldStartCapturingContentFromDeepgram,
          isAvatarSpeaking,
          hasAvatar,
        });

        if (
          hasAvatar &&
          (isAvatarSpeaking || !shouldStartCapturingContentFromDeepgram)
        ) {
          console.log(' ### -- avatar is speaking --- ###');
          return;
        }
        if (isSubmitingAnswer) {
          return;
        }
        setDeepgramText(thisCaption);
        // const processedTranscription = handleText(thisCaption);
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
  }, [deepgramConnectionState, isSubmitingAnswer]);

  useEffect(() => {
    if (!connection) return;

    if (
      // microphoneState !== MicrophoneState.Open &&
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

  console.log('### deeepgram ####', { connection, deepgramConnectionState });

  useEffect(() => {
    const isListening = deepgramConnectionState === 1 && microphoneState === 3;
    setDeegramListening(isListening);
  }, [deepgramConnectionState, microphoneState]);

  // useEffect(() => {
  //   const handleAvatarSpeaking = (event: CustomEventInterface) => {
  //     const isAvatarSpeaking = event?.detail?.isAvatarSpeaking;
  //     if (isAvatarSpeaking === 'SPEAKING') {
  //       console.log('### pausing the audio strem ####', { isAvatarSpeaking });
  //       microphone?.pause();
  //     } else {
  //       console.log('### resuming the audio strem ####', { isAvatarSpeaking });
  //       microphone?.resume();

  //       // need to resume the stream after 2 seconds
  //       // setTimeout(() => {
  //       //   console.log("### resuming the audio strem ####");
  //       //   microphone?.resume();
  //       // }, 2000);
  //     }
  //   };

  //   window.addEventListener('isAvatarSpeaking', handleAvatarSpeaking);
  // }, []);

  // event trigger when avatar scene is loaded or tips are completed
  useEffect(() => {
    const handleAvatarEvent = () => {
      shouldStartCapturingContentFromDeepgram = true;
    };
    window.addEventListener('handleAvatar', handleAvatarEvent);
    // Cleanup function
    return () => {
      window.removeEventListener('handleAvatar', handleAvatarEvent);
    };
  }, []);

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        deepgramText,
        disconnectFromDeepgram,
        deepgramConnectionState,
        handleDeepgramConnection,
        handleDeepgramDisconnection,
        resetDeepgramText,
      }}>
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram(): DeepgramContextType {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error(
      'useDeepgram must be used within a DeepgramContextProvider',
    );
  }
  return context;
}

export {
  DeepgramContextProvider,
  useDeepgram,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
};
