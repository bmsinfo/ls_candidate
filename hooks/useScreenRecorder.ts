import { useRef, useCallback } from 'react';

import { useStore } from '@/app/store/store';
import logger from '@/lib/logger';
import { useSocketProvider } from '@/providers/SocketProvider';

export function useScreenRecorder() {
  const { candidate_uid, session_uid, org_name } = useStore(
    (state) => state.interview,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { emitEvent } = useSocketProvider();

  const initializeRecorder = useCallback(
    async (stream: MediaStream) => {
      const preferredOptions = { mimeType: 'video/webm;codecs=vp9,opus' };
      const backupOptions = { mimeType: 'video/webm;codecs=vp8,opus' };
      const lastResortOptions = { mimeType: 'video/mp4;codecs=avc1' };
      let options = preferredOptions;

      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (!MediaRecorder.isTypeSupported(preferredOptions.mimeType)) {
          options = backupOptions;
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = lastResortOptions;
          }
        }
      }

      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        let sequence_counter = 0;

        // Handle data available event
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            const reader = new FileReader();

            reader.onload = () => {
              const readerData = reader.result as string;
              let messageData = {
                type: 'combined',
                data: readerData,
                candidate_uid: candidate_uid,
                session_uid: session_uid,
                org_name: org_name,
                time_stamp: new Date().toISOString(),
                sequence: sequence_counter++,
              };

              if (mediaRecorderRef.current) {
                // console.log('messageData', messageData);
                emitEvent('stream_data', messageData);
              } else {
                console.log('emitting stream_data socket disconnectd ---', {
                  mediaRecorderRef: mediaRecorderRef.current,
                });
              }
            };
            reader.readAsArrayBuffer(event.data);
          }
        };

        // Handle recording stop
        mediaRecorderRef.current.onstop = () => {
          console.log('Recording stopped');
          // Clean up tracks
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream
              .getTracks()
              .forEach((track) => track.stop());
          }
          mediaRecorderRef.current = null;
        };
      } catch (error) {
        logger('Failed to initialize recorder:', error);
        throw error;
      }
    },
    [emitEvent, candidate_uid, session_uid],
  );

  const startRecording = useCallback(
    (interval: number = 1000) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start(interval);
      }
    },
    [mediaRecorderRef.current],
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, [mediaRecorderRef.current]);

  const pauseMediaRecorder = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      console.log('Recording paused');
    }
  }, [mediaRecorderRef.current]);

  // reset media recorder to null
  const resetMediaRecorder = useCallback(() => {
    mediaRecorderRef.current = null;
  }, []);

  return {
    initializeRecorder,
    startRecording,
    stopRecording,
    pauseMediaRecorder,
    resetMediaRecorder,
    isRecording: mediaRecorderRef.current?.state === 'recording',
  };
}
