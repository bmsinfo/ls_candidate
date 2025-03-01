import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { loggerAPI } from '@/lib/logger';
import { isFirefox } from '@/lib/utils';
import { useSocketProvider } from '@/providers/SocketProvider';

export function useScreenShare() {
  const { push } = useRouter();
  const { disconnectSocket } = useSocketProvider();
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [isScreenSharingSupported, setIsScreenSharingSupported] = useState<
    boolean | null
  >(null);

  // Check screen sharing support on mount
  useEffect(() => {
    const checkScreenSharingSupport = async () => {
      try {
        const supported = !!(
          navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
        );
        setIsScreenSharingSupported(supported);
      } catch (error) {
        setIsScreenSharingSupported(false);
      }
    };

    checkScreenSharingSupport();
  }, []);

  const validateScreenShare = useCallback((stream: MediaStream): boolean => {
    if (isFirefox()) {
      const videoTrack = stream.getVideoTracks()[0];
      return videoTrack?.label === 'Primary Monitor';
    }

    const trackSettings = stream.getVideoTracks()[0].getSettings();
    return trackSettings.displaySurface === 'monitor';
  }, []);

  const requestScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Validate screen share as 'Entire screen'
      if (!validateScreenShare(screenStream)) {
        screenStream.getTracks().forEach((track) => track.stop());
        // await requestScreenShare(); // Retry screen share
        throw new Error('Please select the entire screen');
      }

      screenStreamRef.current = screenStream;
      return { success: true, stream: screenStream };
    } catch (error) {
      throw error;
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
  }, [screenStreamRef.current]);

  const navigateToPermissionPage = useCallback(() => {
    push('/permissions?reload=true');
  }, []);

  // Event listeners for track ended events
  useEffect(() => {
    const handleStreamEnd = () => {
      loggerAPI({
        event: 'stream_ended',
        message: `screen stream ended by candidate`,
      });

      stopScreenShare();
      disconnectSocket();
      navigateToPermissionPage();
    };

    if (screenStreamRef.current) {
      screenStreamRef.current.getVideoTracks()[0].onended = () =>
        handleStreamEnd();
    }

    return () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getVideoTracks()[0].onended = handleStreamEnd;
      }
    };
  }, [screenStreamRef.current]);

  return {
    screenStreamRef,
    requestScreenShare,
    stopScreenShare,
    isScreenSharingSupported,
  };
}
