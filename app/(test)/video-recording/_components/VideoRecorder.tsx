'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import logger from '@/lib/logger';
import { cn } from '@/lib/utils';

import { useSocketProvider } from '../../../../providers/SocketProvider';

export const VideoRecorder = React.memo(() => {
  const [candidateID, setCandidateId] = useState('');
  const [sessionID, setSessionId] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const webcamStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const {
    emitEvent,
    connectSocket,
    disconnectSocket,
    connected,
    socketConnectCounter,
  } = useSocketProvider();

  const setupAudio = async () => {
    const audioContext = new window.AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    return destination.stream;
  };

  const setupCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const audioConstraints = {
          // audio:true,
          video: true,
        };

        const webcamStream =
          await navigator.mediaDevices.getUserMedia(audioConstraints);
        webcamStreamRef.current = webcamStream;

        (videoRef.current as HTMLVideoElement).srcObject = webcamStream;
      } catch (error) {
        console.error('Error setting up camera:', error);
      }
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = screenStream; // store the current stream for later use
      (screenVideoRef.current as HTMLVideoElement).srcObject = screenStream;
      connectSocket();

      await initializeMediaRecorder();
      setTimeout(() => {
        startRecording();
      }, 1000);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const initializeMediaRecorder = async () => {
    const audioStream = await setupAudio();
    const combinedStream = createCombinedStream(audioStream);
    if (!combinedStream) {
      logger('Failed to create combined stream');
      return;
    }
    mediaRecorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm;codecs=vp9,opus',
    });
    let sequence_counter = 0;

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          const readerData = reader.result as string;
          let messageData = {
            type: 'combined',
            data: readerData,
            candidate_uid: candidateID,
            session_uid: sessionID,
            org_name: 'org_name_test',
            time_stamp: new Date().toISOString(),
            sequence: sequence_counter++,
          };
          if (mediaRecorderRef.current) {
            console.log('messageData', messageData);

            emitEvent('stream_data', messageData);
          } else {
            console.log('emitting stream_data', {
              mediaRecorderRef: mediaRecorderRef.current,
            });
          }
        };
        reader.readAsArrayBuffer(event.data);
      }
    };
    mediaRecorderRef.current.onstop = async () => {
      console.log('Recording stopped');
      console.log(' ---- setting mediaRecorderRef stream to null ----');
      // Clean up tracks
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      mediaRecorderRef.current = null;
    };
  };

  const createCombinedStream = (audioStream: MediaStream) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      logger('Canvas is not initialized');
      return;
    }
    const ctx = ctxRef.current;
    canvas.width = 1280;
    canvas.height = 720;
    const combinedStream = canvas.captureStream(30);

    console.log('webcamStreamRef.current', webcamStreamRef.current);
    if (!webcamStreamRef.current?.active) {
      logger('Webcam stream not found!', 'handlingStreamData');
      throw new Error('Cannot continue without a webcam stream');
    }
    const webcamVideo = document.createElement('video');
    webcamVideo.srcObject = webcamStreamRef.current;
    webcamVideo.muted = true;
    webcamVideo.play();

    if (!screenStreamRef.current) {
      logger('screen stream not found', 'handlingStreamData');
      throw new Error('Cannot continue without a screen stream');
    }

    const screenVideo = document.createElement('video');
    screenVideo.srcObject = screenStreamRef.current;
    screenVideo.play();
    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        const webcamWidth = canvas.width / 4;
        const webcamHeight =
          (webcamWidth * webcamVideo.videoHeight) / webcamVideo.videoWidth;
        ctx.drawImage(
          webcamVideo,
          canvas.width - webcamWidth - 10,
          10,
          webcamWidth,
          webcamHeight,
        );
      } else {
        logger('Canvas context not initialized');
      }
      requestAnimationFrame(draw); // keep drawing
    };
    requestAnimationFrame(draw); // start drawing
    audioStream
      .getAudioTracks()
      .forEach((track) => combinedStream.addTrack(track));
    return combinedStream;
  };

  const startRecording = () => {
    console.log('SSSSSS rrrrrr ---- ', {
      mediaRecorderRef: mediaRecorderRef.current,
    });
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start(1000);
      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log('Recording stopped');
    }
  };

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvasRef.current = canvas;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    async function handleSocketConnection() {
      if (!sessionID || !candidateID) {
        return;
      }
      console.log({ socketConnectCounter });
      if (connected && socketConnectCounter > 1) {
        mediaRecorderRef.current = null;

        await initializeMediaRecorder();
        startRecording();
      } else if (!connected && socketConnectCounter >= 1) {
        mediaRecorderRef.current?.stop();
      } else {
        console.log('### scocket mediaRecorderRef.current ###', {
          mediaRecorderRef: mediaRecorderRef.current,
          socketConnectCounter,
        });
      }
    }
    handleSocketConnection();
  }, [connected]);

  console.log('### video-recoring-test ####');

  return (
    <div>
      <div>
        <div className="flex">
          {/* // create form where we can eenter the session id and candidate id  */}

          <div className=" my-10">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 mr-2"
              value={sessionID}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Session ID"
            />
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2  mr-2"
              value={candidateID}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Candidate ID"
            />
          </div>

          <video
            className={cn(' size-40', {
              //  "hidden" :hideWebCam
            })}
            ref={videoRef}
            autoPlay></video>

          <video
            className={cn(' size-40', {
              //  "hidden" :hideWebCam
            })}
            ref={screenVideoRef}
            autoPlay></video>
        </div>

        <Button onClick={stopRecording}>Stop Recording</Button>

        {/* start screen sharing */}

        <Button onClick={() => setupCamera()}>Open camera</Button>
        <Button onClick={() => shareScreen()}>Share Screen</Button>
        <Button onClick={() => disconnectSocket()}>disconnect socket</Button>
      </div>
    </div>
  );
});

VideoRecorder.displayName = 'VideoRecorder';

export default VideoRecorder;

// useEffect(()=>{
//   if (screenStreamRef.current) {
//     screenStreamRef.current.getVideoTracks()[0].onended = () => {
//       console.log("----- #### screen stream ended ### ------")
//       setReasonForReload('screen stream ended by candidate');
//       setPermissionSteps(1);
//       setErrorMessage('Entire screen sharing ended by candidate.');
//       hardCleanup();
//       disconnectSocket();
//       navigateToPermissionPage();
//     };
//   }

//   if (webcamStreamRef.current) {
//     webcamStreamRef.current.getVideoTracks()[0].onended = () => {
//       console.log("----- #### webcam stream ended ### ------")
//       setReasonForReload('webcam stream ended by candidate');
//       setPermissionSteps(1);
//       setErrorMessage('Webcam stream ended by candidate.');
//       hardCleanup();
//       disconnectSocket();
//       navigateToPermissionPage();
//     };
//   }

// },[screenStreamRef.current,webcamStreamRef])
