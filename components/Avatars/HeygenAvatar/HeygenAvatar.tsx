import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import { toast } from 'sonner';

import { fetchHeygenAccessToken } from '@/app/serverActions/avatar';
import { useDevice } from '@/hooks/useDevice';
import useIntroSpeech from '@/hooks/useIntroSpeech';
import { HEYGEN_AVATAR_ID, HEYGEN_VOICE_ID } from '@/lib/constants';
import { loggerAPI } from '@/lib/logger';

import useHeygen from './useHeygen';

interface Props {
  setIsAvatarLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

window.heygenAvatar = null;

export default function HeygeAvatar({ setIsAvatarLoaded }: Props) {
  const { push } = useRouter();
  const isMobile = useDevice();
  const { playIntroSpeech, handleIntroCompletion } = useIntroSpeech();
  const { heygenEndSession, heygenSpeak } = useHeygen();
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const [stream, setStream] = useState<MediaStream>();
  const isInitializedRef = useRef(false);
  const isAvatarSceneLoadedRef = useRef(false);
  const mediaStream = useRef<HTMLVideoElement>(null);

  const handleStreamReady = useCallback(
    (event: CustomEvent<MediaStream>) => {
      console.log('>>>>> Stream ready:', event.detail);
      setStream(event.detail);
      setIsAvatarLoaded(true);
      handleAvatarSceneLoaded();
    },
    [setIsAvatarLoaded],
  );

  const setupEventListeners = useCallback(
    (avatar: StreamingAvatar) => {
      avatar.on(StreamingEvents.USER_START, () => console.log('Listening'));
      avatar.on(StreamingEvents.USER_STOP, () => console.log('Processing'));
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () =>
        console.log('Avatar speaking'),
      );
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () =>
        console.log('Waiting for speech'),
      );
      avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log(' ##### Stream has been disconnected ####');
        // Handle the disconnection, e.g., clean up the UI or try to reconnect the session
        initializeAvatarSession();
      });
    },
    [handleStreamReady],
  );

  const initializeAvatarSession = useCallback(async () => {
    try {
      setIsLoadingSession(true);

      const token = await fetchHeygenAccessToken();
      window.heygenAvatar = new StreamingAvatar({ token });
      console.log('Heygen Avatar initialized', { HEYGEN_AVATAR_ID });
      const heygenSession = await window.heygenAvatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: (HEYGEN_AVATAR_ID as string) || 'default',
        voice: {
          voiceId: HEYGEN_VOICE_ID as string,
          rate: 1, // 0.5 ~ 1.5
          emotion: VoiceEmotion.FRIENDLY,
        },
        disableIdleTimeout: true,
        // disableIdleTimeout: false, // for TESting
        language: 'en', // Use correct language code
      });
      console.log({ heygenSession });

      setupEventListeners(window.heygenAvatar);
    } catch (error) {
      console.error('Error starting avatar session:', error);
      toast.error('Error starting avatar session');
      setIsAvatarLoaded(false);

      push('/interview/v0');
      loggerAPI({
        event: 'heygen_avatar',
        status: 'error',
        reason: 'Error : Failed to start avatar session',
        message:
          'Error starting heygen avatar and navigate to simple interview mode',
      });
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        // setDebug('Playing');
      };
    }
  }, [mediaStream, stream]);

  console.log('hhhhhhhh hhh ::::', window?.heygenAvatar);

  const handleAvatarSceneLoaded = useCallback(async () => {
    if (!isAvatarSceneLoadedRef.current) {
      console.log('#### avatar loaded #####');
      isAvatarSceneLoadedRef.current = true;
      setIsAvatarLoaded(true);
      await playIntroSpeech(heygenSpeak);
      handleIntroCompletion();
    }
  }, []);

  useEffect(() => {
    // make sure that this is called only once when the component is mounted
    if (!isInitializedRef.current) {
      initializeAvatarSession();
      isInitializedRef.current = true;
    }

    return () => {
      heygenEndSession();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-full">
        <div className="h-full flex flex-col justify-center items-center">
          {stream && (
            <div className="h-full w-full justify-center aspect-video items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                className="aspect-video"
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  // objectFit: 'contain',
                }}>
                <track kind="captions" />
              </video>
            </div>
          )}

          {isLoadingSession && (
            <div className=" absolute inset-0 bg-white flex items-center justify-center">
              <span className="text-primary text-sm font-semibold">
                connecting...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
