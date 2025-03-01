'use client';

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';

import { Camera } from '@mediapipe/camera_utils';
import { FaceDetection } from '@mediapipe/face_detection';

import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useMediaPermission } from '@/providers/MediaProvider';

// Define the types for the exposed methods
export interface VideoWrapperRef {
  captureSelfie: () => void;
  retakeSelfie: () => void;
  getSelfie: () => string | null;
  resetTimesOutOfFrame: () => void;
  numberTimesCandidateGotOutOfFrame: number;
}

interface Props {
  isBlinkIcon?: boolean;
  isFaceDetectionEnabled?: boolean;
}

// Forward ref to VideoWrapper
const VideoWrapper = forwardRef(
  (
    { isBlinkIcon = false, isFaceDetectionEnabled = false }: Props,
    ref: React.Ref<VideoWrapperRef>,
  ) => {
    const { webcamStream, setCandidateSelfie } = useMediaPermission();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const faceDetectedRef = useRef(false); // Tracks face detection state
    const numberTimesCandidateGotOutOfVideoFrame = useRef(0); // Tracks number of times face left the frame
    const cameraRef = useRef<Camera | null>(null);
    const boundingBoxCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const increaseTimesOutOfFrame = useCallback(() => {
      numberTimesCandidateGotOutOfVideoFrame.current += 1;
    }, []);

    const resetTimesOutOfFrame = useCallback(() => {
      numberTimesCandidateGotOutOfVideoFrame.current = 0;
    }, []);

    // Capture a selfie from the webcam
    const captureSelfie = useCallback((): void => {
      const video = videoRef?.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        toast({
          variant: 'destructive',
          title: 'Video or canvas element is not initialized',
        });
        return;
      }

      if (!faceDetectedRef.current) {
        toast({
          variant: 'destructive',
          title: 'No face detected',
        });
        return;
      }

      // Set the canvas size to match the video stream dimensions
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCandidateSelfie(imageDataUrl);
        toast({
          title: 'Selfie captured!',
          description: 'Your selfie has been captured.',
        });
      }
    }, [videoRef, setCandidateSelfie]);

    // 'getSelfie' function used while submit the answer
    const getSelfie = useCallback(() => {
      const video = videoRef?.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        toast({
          variant: 'destructive',
          title: 'Video or canvas element is not initialized',
        });
        return null;
      }

      // Set the canvas size to match the video stream dimensions
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current frame from the video onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert the canvas content to a base64 image
        return canvas.toDataURL('image/jpeg');
      }
      return null;
    }, [videoRef]);

    // Reset selfie state
    const retakeSelfie = useCallback((): void => {
      setCandidateSelfie(''); // Clear the current selfie
    }, [setCandidateSelfie]);

    // Load Face Detection and Camera
    const loadFaceDetection = useCallback(() => {
      console.log('#### load Face detection ###');
      const video = videoRef?.current;
      const boundingBoxCanvas = boundingBoxCanvasRef.current;

      if (!video || !boundingBoxCanvas) {
        console.error('Video or bounding box canvas not ready');
        return;
      }
      const faceDetection = new FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetection.setOptions({
        model: 'short', // Use short-range model for close face detection
        minDetectionConfidence: 0.8,
      });

      const context = boundingBoxCanvas.getContext('2d');
      if (!context) {
        console.error('Failed to get bounding box canvas context');
        return;
      }

      // Set the canvas size to match the video dimensions
      boundingBoxCanvas.width = video.videoWidth;
      boundingBoxCanvas.height = video.videoHeight;
      const canvas = boundingBoxCanvasRef.current;

      faceDetection.onResults((results) => {
        const faceDetected = results.detections.length > 0;
        if (faceDetected) {
          if (!canvas || !video) return;

          const context = canvas.getContext('2d');
          if (!context) {
            console.error('Failed to get canvas context');
            return;
          }

          // Set the canvas size to match the video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Clear previous drawings on the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Get the bounding box from the detection result
          const boundingBox = results.detections[0]?.boundingBox;

          if (boundingBox) {
            const { xCenter, yCenter, width, height } = boundingBox;

            // Convert the center coordinates to top-left corner coordinates
            const boxX = (xCenter - width / 2) * canvas.width;
            const boxY = (yCenter - height / 2) * canvas.height;
            const boxWidth = width * canvas.width;
            const boxHeight = height * canvas.height;

            // Set the bounding box style
            context.strokeStyle = 'red';
            context.lineWidth = 8;

            // Draw the bounding box
            context.strokeRect(boxX, boxY, boxWidth, boxHeight);
          }
        } else {
          // If no face is detected, clear the bounding box
          const context = canvas?.getContext('2d');
          if (context) {
            context.clearRect(
              0,
              0,
              canvas?.width as number,
              canvas?.height as number,
            );
          }
        }

        if (faceDetectedRef.current !== faceDetected) {
          faceDetectedRef.current = faceDetected;

          if (!faceDetected) {
            increaseTimesOutOfFrame(); // Increment count if face left the frame
          }
          console.log(
            faceDetected ? 'Face detected' : 'No face detected',
            numberTimesCandidateGotOutOfVideoFrame.current,
            { faceDetectedRef: faceDetectedRef.current },
          );
        }
      });

      cameraRef.current = new Camera(video, {
        onFrame: async () => {
          await faceDetection.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    }, [increaseTimesOutOfFrame, videoRef]);

    useEffect(() => {
      if (videoRef?.current?.srcObject) {
        if (isFaceDetectionEnabled) {
          loadFaceDetection();
        }
      }
      return () => {
        cameraRef.current?.stop();
      };
    }, [videoRef?.current?.srcObject, isFaceDetectionEnabled]);

    // Sync the video stream with the video element
    useEffect(() => {
      if (webcamStream && videoRef?.current) {
        videoRef.current.srcObject = webcamStream;
      }
    }, [webcamStream, videoRef?.current]);

    useImperativeHandle(ref, () => ({
      captureSelfie,
      retakeSelfie,
      getSelfie,
      resetTimesOutOfFrame,
      numberTimesCandidateGotOutOfFrame:
        numberTimesCandidateGotOutOfVideoFrame.current,
    }));

    console.log('------ video wrapper ------', videoRef?.current);
    console.log(
      '------ video wrapper src ------',
      videoRef?.current?.srcObject,
    );

    return (
      <div className="relative">
        {/* Used for bounding box */}
        <canvas
          ref={boundingBoxCanvasRef}
          className="absolute z-10 top-0 left-0  h-full w-full "
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <video
          className={cn('w-full rounded-2xl bg-black h-full')}
          ref={videoRef}
          autoPlay
          muted
        />
        {videoRef?.current?.srcObject && isBlinkIcon && (
          <div className="absolute top-2 right-2 bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  },
);

VideoWrapper.displayName = 'VideoWrapper';

export default React.memo(VideoWrapper);
