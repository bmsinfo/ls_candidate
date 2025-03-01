import { useState, useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { loggerAPI } from '@/lib/logger';

interface MediaDeviceState {
  hasPermission: boolean;
  stream: MediaStream | null;
  error: Error | null;
}

export function useMediaDevices() {
  const { push } = useRouter();
  const [webcamState, setWebcamState] = useState<MediaDeviceState>({
    hasPermission: false,
    stream: null,
    error: null,
  });

  const [micState, setMicState] = useState<MediaDeviceState>({
    hasPermission: false,
    stream: null,
    error: null,
  });

  const [isRequestingMedia, setIsRequestingMedia] = useState(false);

  // Shared cleanup function
  const stopStream = useCallback((stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // Base request function for media devices
  const requestMedia = useCallback(
    async (
      type: 'webcam' | 'microphone',
      constraints: MediaStreamConstraints,
    ) => {
      if (!navigator.mediaDevices) {
        toast.error('Your browser does not support media devices.');
        loggerAPI({
          event: 'startCamera',
          status: 'error',
          reason: 'Browser does not support media devices.',
        });
        return;
      }
      setIsRequestingMedia(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const newState = {
          hasPermission: true,
          stream,
          error: null,
        };

        if (type === 'webcam') {
          setWebcamState(newState);
        } else {
          setMicState(newState);
        }

        loggerAPI({
          event: 'Permissions',
          status: 'success',
          message: `${type === 'webcam' ? 'Webcam' : 'Microphone'} Permissions Granted`,
        });
        return stream;
      } catch (error) {
        const newState = {
          hasPermission: false,
          stream: null,
          error: error as Error,
        };

        if (type === 'webcam') {
          setWebcamState(newState);
        } else {
          setMicState(newState);
        }

        loggerAPI({
          event: 'Permissions',
          status: 'error',
          reason: `${type === 'webcam' ? 'Webcam' : 'Microphone'} Permissions Denied`,
        });
        toast.error(
          `${type === 'webcam' ? 'Camera' : 'Microphone'} Error : Failed to access device. Please check your settings.`,
        );

        return null;
      } finally {
        setIsRequestingMedia(false);
      }
    },
    [],
  );

  // Specific device request functions
  const requestWebcam = useCallback(
    async (deviceId?: string) => {
      const constraints = {
        facingMode: 'user', // Use front camera by default
        video: deviceId ? { deviceId } : true,
      };
      return requestMedia('webcam', constraints);
    },
    [requestMedia],
  );

  const requestMicrophone = useCallback(
    async (deviceId?: string) => {
      const constraints = {
        audio: deviceId
          ? {
              deviceId,
              echoCancellation: true,
              noiseSuppression: true,
            }
          : {
              echoCancellation: true,
              noiseSuppression: true,
            },
      };
      return requestMedia('microphone', constraints);
    },
    [requestMedia],
  );

  // Toggle functions
  const toggleWebcam = useCallback(async () => {
    if (webcamState.stream) {
      stopStream(webcamState.stream);
      setWebcamState({
        hasPermission: false,
        stream: null,
        error: null,
      });
    } else {
      await requestWebcam();
    }
  }, [webcamState.stream, requestWebcam, stopStream]);

  const toggleMicrophone = useCallback(async () => {
    if (micState.stream) {
      stopStream(micState.stream);
      setMicState({
        hasPermission: false,
        stream: null,
        error: null,
      });
    } else {
      await requestMicrophone();
    }
  }, [micState.stream, requestMicrophone, stopStream]);

  // Error message formatter
  const getErrorMessage = useCallback((error: Error | null) => {
    if (!error) return '';

    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'Permission denied. Please allow access in your browser settings.';
      case 'NotFoundError':
        return 'No media device found. Please connect a camera or microphone.';
      case 'NotReadableError':
        return 'Media device is in use by another application.';
      case 'NotActiveError':
        return 'Webcam stream not found. Please refresh the page and try again';
      default:
        return 'An error occurred while accessing media device.';
    }
  }, []);

  const navigateToPermissionPage = useCallback(() => {
    push('/permissions?reload=true');
  }, []);

  // Event listeners for track ended events
  useEffect(() => {
    const handleWebcamTrackEnded = () => {
      setWebcamState((prev) => ({
        ...prev,
        hasPermission: false,
        stream: null,
      }));
      toast.warning('Camera has been disconnected');
      loggerAPI({
        event: 'webcam',
        status: 'info',
        message: 'Webcam track ended',
      });
      navigateToPermissionPage();
    };

    const handleMicTrackEnded = () => {
      setMicState((prev) => ({
        ...prev,
        hasPermission: false,
        stream: null,
      }));
      toast.warning('Microphone has been disconnected');
      loggerAPI({
        event: 'microphone',
        status: 'info',
        message: 'Microphone track ended',
      });
      navigateToPermissionPage();
    };

    // Add listeners to webcam tracks
    webcamState.stream?.getTracks().forEach((track) => {
      track.addEventListener('ended', handleWebcamTrackEnded);
    });

    // Add listeners to microphone tracks
    micState.stream?.getTracks().forEach((track) => {
      track.addEventListener('ended', handleMicTrackEnded);
    });

    // Cleanup function
    return () => {
      webcamState.stream?.getTracks().forEach((track) => {
        track.removeEventListener('ended', handleWebcamTrackEnded);
      });
      micState.stream?.getTracks().forEach((track) => {
        track.removeEventListener('ended', handleMicTrackEnded);
      });
    };
  }, [webcamState.stream, micState.stream]);

  return {
    // States
    hasWebcamPermission: webcamState.hasPermission,
    hasMicPermission: micState.hasPermission,
    isRequestingMedia,
    webcamError: getErrorMessage(webcamState.error),
    micError: getErrorMessage(micState.error),

    // update state
    setWebcamState,
    setMicState,

    // Streams
    webcamStream: webcamState.stream,
    micStream: micState.stream,

    // Actions
    requestWebcam,
    requestMicrophone,
    toggleWebcam,
    toggleMicrophone,
    stopStream,

    // Support
    isSupported: !!navigator.mediaDevices?.getUserMedia,
  };
}
