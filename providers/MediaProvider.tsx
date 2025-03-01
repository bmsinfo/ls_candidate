'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useStore } from '@/app/store/store';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useScreenRecorder } from '@/hooks/useScreenRecorder';
import { useScreenShare } from '@/hooks/useScreenShare';
import logger, { loggerAPI } from '@/lib/logger';
import { isFirefox, sleep } from '@/lib/utils';

import { useSocketProvider } from './SocketProvider';

type DeviceItems = MediaDeviceInfo[];

type DeviceList = {
  video: DeviceItems;
  audio: DeviceItems;
};
interface MediaContextType {
  startCamera: VoidFunction;

  permissionGranted: Boolean;
  errorMessage: string;
  videoDeviceId: string;
  selectVideo: (id: string) => void;
  deviceList: DeviceList;
  audioDeviceId: string;
  selectAudio: (id: string) => void;
  startAv: VoidFunction;

  // stopScreenMedia: VoidFunction;
  videoRef: React.RefObject<HTMLVideoElement> | null;
  setErrorMessage: (message: string) => void;

  haveDeviceAccess: Boolean;
  isRequestingMedia: boolean;
  reset: () => void;

  candidateSelfie: string;
  setCandidateSelfie: (candidate: string) => void;
  setPermissionSteps: (val: number) => void;
  permissionSteps: number;
  isSharing: Boolean;
  navigateToPermissionPage: VoidFunction;

  // ######  custom hooks ########
  // Media Devices
  hasWebcamPermission: boolean;
  hasMicPermission: boolean;
  toggleMicrophone: () => Promise<void>;
  toggleWebcam: () => Promise<void>;
  micError: string;
  webcamError: string;

  webcamStream: MediaStream | null;
  // Screen Share
  startScreenShare: () => Promise<void>;
  startCameraRecording: () => Promise<void>;
  isScreenSharingSupported: boolean | null;
  stopScreenShare: () => void;
}

interface MediaProviderProps {
  children: ReactNode;
}

export const getAudioContext = () =>
  (typeof window !== undefined && window.AudioContext) ||
  (window as any).webkitAudioContext;

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const { push } = useRouter();
  const {
    connectSocket,
    connected,
    disconnectSocket,
    emitEvent,
    socket,
    socketConnectCounter,
  } = useSocketProvider();

  const {
    hasWebcamPermission,
    hasMicPermission,
    toggleMicrophone,
    toggleWebcam,
    micError,
    webcamError,
    webcamStream,
    micStream,
    setWebcamState,
    isRequestingMedia,
  } = useMediaDevices();

  const {
    requestScreenShare,
    stopScreenShare,
    screenStreamRef,
    isScreenSharingSupported,
  } = useScreenShare();

  const {
    initializeRecorder,
    startRecording,
    stopRecording,
    pauseMediaRecorder,
    resetMediaRecorder,
  } = useScreenRecorder();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamingFunctionRef = useRef(0);

  // const screenStreamRef = useRef<MediaStream | null>(null);

  const [candidateSelfie, setCandidateSelfie] = useState<string>(''); // State to store the captured screenshot
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoDeviceId, setVideoDeviceId] = useState('');
  const [audioDeviceId, setAudioDeviceId] = useState('');
  const [permissionSteps, setPermissionSteps] = useState(1);
  const [isSharing, setIsSharing] = useState(false);

  const [haveDeviceAccess, setHaveDeviceAccess] = useState(false);
  const [_, setIsRequestingMedia] = useState(false);

  const setReasonForReload = useStore((state) => state.setReasonForReload);

  const [deviceList, setDevices] = useState({
    video: [],
    audio: [],
  } as DeviceList);

  const [deviceLabels, setDeviceLabels] = useState({
    audio: '',
    video: '',
  });
  const selectVideo = useCallback((id: string) => {
    setVideoDeviceId(id);
  }, []);

  const selectAudio = useCallback((id: string) => {
    setAudioDeviceId(id);
  }, []);

  const getDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setErrorMessage(
        'Failed to list available devices.( Please try again / or use a different browser )',
      );
      return;
    }

    try {
      // in-case : if candidate change the 'audio or video' input device in ongoing interview.
      if (socket?.active) {
        setReasonForReload('input / output device change');
        console.log('###### input / output device change ######');
        disconnectSocket;
        window.location?.reload();
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const list: DeviceList = { video: [], audio: [] };

      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          list.video.push(device);
        }
        if (device.kind === 'audioinput') {
          list.audio.push(device);
        }
      });

      // set the audioDeviceIds and videoDeviceId if we dont have any device id yet
      if (list.video?.[0]?.deviceId && !videoDeviceId) {
        selectVideo(list.video[0].deviceId);
      }
      if (list.audio?.[0]?.deviceId && !audioDeviceId) {
        selectAudio(list.audio[0].deviceId);
      }
      // TODO: need to optimize this
      setDeviceLabels({
        audio: list.video[0].label,
        video: list.audio[0].label,
      });
      setDevices({ ...list });
    } catch (error) {
      setErrorMessage('Failed to list available devices. Please try again');
      toast.error('Failed to list available devices. Please try again');
    }
  }, [
    audioDeviceId,
    videoDeviceId,
    setDevices,
    selectAudio,
    selectVideo,
    socket,
  ]);

  console.log({ audioDeviceId, videoDeviceId });

  const navigateToPermissionPage = useCallback(() => {
    push('/permissions?reload=true');
  }, []);

  const memoizedDeviceList = useMemo(() => deviceList, [deviceList]);

  const setupAudio = async () => {
    console.log(' stream Audio setup start ');
    const audioContext = new window.AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    console.log(' stream Audio setup complete end');
    return destination.stream;
  };

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices) {
      logger('Your browser does not support media devices', 'startCamera');
      setErrorMessage('Your browser does not support media devices.');
      loggerAPI({
        event: 'startCamera',
        status: 'error',
        reason: 'Browser does not support media devices.',
      });
      return;
    }

    const video = videoDeviceId ? { deviceId: videoDeviceId } : true;
    const audio = audioDeviceId ? { deviceId: audioDeviceId } : true;
    const constraints = { video, audio };
    try {
      /*
       * We have to call getDevices() twice b/c of firefox.
       * The first time we getDevices() in firefox the device.label is an empty string
       * After getUserMedia() happens successfully, then we can getDevices() again to
       * and the 2nd time then device.label will be populated :shrug:
       */
      await getDevices();
      logger('requesting user media with constraints', constraints);
      /*
       * This gets called when a new device is selected, we want to stopUserMedia()
       * when re-initializing a camera
       *
       * You will notice that in startScreenshare() we do not call stopUserMedia()
       * because we want the screenshare to stay the same while the microphone input
       * gets changed
       */
      // stopUserMedia();
      setIsRequestingMedia(true);

      await navigator.mediaDevices.getUserMedia(constraints);
      setIsRequestingMedia(false);
      setErrorMessage('');
      await getDevices();
      setPermissionGranted(true);

      // assignWebCamStreamForBrowserPlayback();
      setPermissionSteps(2);
      setErrorMessage('');

      loggerAPI({
        event: 'startCamera',
        status: 'success',
        message: 'Camera started successfully.',
        camera: JSON.stringify(deviceLabels),
      });
    } catch (err) {
      setIsRequestingMedia(false);
      console.error('Error accessing media devices:', err);
      setErrorMessage(
        'Error getting devices, you may have denied access already, if so you will have to allow access in browser settings.',
      );
      toast.error(
        'Error getting devices, you may have denied access already, if so you will have to allow access in browser settings.',
      );
      loggerAPI({
        event: 'startCamera',
        status: 'error',
        reason: 'Failed to access camera or microphone.',
      });
    }
  }, [videoDeviceId, audioDeviceId, getDevices]);

  console.log('--------### video-Wrapper ### ----- startcamera---', {
    videoRef: videoRef?.current?.srcObject,
  });

  const createCombinedStream = useCallback(
    async (screenStream: MediaStream) => {
      try {
        return new MediaStream([
          ...screenStream.getVideoTracks(),
          ...(micStream?.getAudioTracks() || []),
          // Add audio tracks for avatar
          ...(
            await navigator.mediaDevices.getUserMedia({
              audio: { autoGainControl: false },
            })
          ).getAudioTracks(),
        ]);
      } catch (error) {
        logger('Error creating combined stream:', error);
        throw error;
      }
    },
    [],
  );

  const startScreenShare = useCallback(async () => {
    // check if we have the microphone permission and webcam permission
    if (!hasMicPermission || !hasWebcamPermission) {
      toast.error('Please allow microphone and webcam permission');
      throw new Error('Missing microphone or webcam permission');
    }

    console.log({ webcamStreamStatus: webcamStream });
    // check if the webcam is active
    if (!webcamStream?.active) {
      const errorMsg =
        'Webcam stream not found. Please refresh the page and try again';
      toast.error(errorMsg);
      setWebcamState({
        hasPermission: false,
        stream: null,
        error: { name: 'NotActiveError', message: errorMsg },
      });
      throw new Error(errorMsg);
    }

    try {
      // request screen share
      const { stream } = await requestScreenShare();

      if (!stream || stream.active === false || stream === undefined) {
        throw new Error('Failed to get screen stream');
      }

      connectSocket();
      // Create combined stream with audio
      const combinedStream = await createCombinedStream(stream);
      await initializeRecorder(combinedStream);

      await sleep(1000);
      startRecording();

      streamingFunctionRef.current = 1; // keep track we need to call intializeMediaRecorder on reconnect
    } catch (error) {
      throw error;
    }
  }, [hasMicPermission, hasWebcamPermission, webcamStream]);

  const startCameraRecording = useCallback(async () => {
    // Check microphone and webcam permissions
    if (!hasMicPermission || !hasWebcamPermission) {
      toast.error('Please allow microphone and webcam permission');
      throw new Error('Missing microphone or webcam permission');
    }

    console.log({ webcamStreamStatus: webcamStream });

    // Check if the webcam is active
    if (!webcamStream?.active) {
      const errorMsg =
        'Webcam stream not found. Please refresh the page and try again';
      toast.error(errorMsg);
      setWebcamState({
        hasPermission: false,
        stream: null,
        error: { name: 'NotActiveError', message: errorMsg },
      });
      throw new Error(errorMsg);
    }

    try {
      connectSocket();
      const combinedStream = await createCombinedStream(webcamStream);
      await initializeRecorder(combinedStream);

      await sleep(1000);
      startRecording();

      streamingFunctionRef.current = 1; // Keep track of recording state
    } catch (error) {
      throw error;
    }
  }, [hasMicPermission, hasWebcamPermission, webcamStream]);

  console.log({ deviceList });

  /*
   * reset error message, cancel audio interval
   */

  const cleanup = useCallback(() => {
    logger('cleanup');

    setErrorMessage('');
    setCandidateSelfie('');
  }, []);

  /*
   * do a cleanup, and also cancel all media streams
   */
  const hardCleanup = useCallback(() => {
    cleanup();
    // stopUserMedia();
    // stopScreenMedia();
    setPermissionGranted(false);
    setHaveDeviceAccess(false);
    setVideoDeviceId('');
    setAudioDeviceId('');
    setCandidateSelfie('');
  }, []);

  const reset = async () => {
    hardCleanup();
  };

  const startAv = () => {
    cleanup();
    startCamera();
  };

  useEffect(() => {
    async function handleSocketConnection() {
      console.log({ socketConnectCounter });
      if (connected && socketConnectCounter > 1) {
        // mediaRecorderRef.current = null;
        resetMediaRecorder();
        console.log('#### initializeMediaRecorder before ####');
        // await initializeMediaRecorder();
        const stream = screenStreamRef.current as MediaStream;
        const combinedStream = await createCombinedStream(stream);

        await initializeRecorder(combinedStream);
        // await handlingStreamData();
        // startRecording();
        setTimeout(() => {
          console.log('### start againg after disconnect ###');
          startRecording();
        }, 1000);
      } else if (!connected && socketConnectCounter >= 1) {
        // mediaRecorderRef.current?.pause();
        pauseMediaRecorder();
      } else {
        console.log('### scocket mediaRecorderRef.current ###', {
          // mediaRecorderRef: mediaRecorderRef.current,
          socketConnectCounter,
        });
      }
    }
    handleSocketConnection();
  }, [connected]);

  useEffect(() => {
    //
    // This updates the device list when the list changes. For example
    // plugging in or unplugging a mic or camera
    //
    if (navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = getDevices;
    }
  }, []);

  useEffect(() => {
    if (videoDeviceId || audioDeviceId) {
      startAv();
    }
  }, [videoDeviceId, audioDeviceId]);

  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  return (
    <MediaContext.Provider
      value={{
        startCamera,
        permissionGranted,
        audioDeviceId,
        videoDeviceId,
        selectVideo,
        selectAudio,
        startAv,

        deviceList: memoizedDeviceList,
        errorMessage,
        videoRef,
        haveDeviceAccess,
        isRequestingMedia,
        reset,

        candidateSelfie,
        setCandidateSelfie,
        permissionSteps,
        setPermissionSteps,
        isSharing,
        setErrorMessage,
        navigateToPermissionPage,

        // Media Devices
        hasWebcamPermission,
        hasMicPermission,
        toggleMicrophone,
        toggleWebcam,
        micError,
        webcamError,
        webcamStream,
        // Screen Share
        startScreenShare,
        startCameraRecording,
        isScreenSharingSupported,
        stopScreenShare,
      }}>
      {children}
    </MediaContext.Provider>
  );
};

// Custom hook to use the UI context
export const useMediaPermission = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaPermission must be used within a MediaProvider');
  }
  return context;
};
