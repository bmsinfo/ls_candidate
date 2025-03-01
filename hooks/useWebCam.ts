'use client';

import { useCallback, useRef } from 'react';

import { toast } from 'sonner';

export const useWebCam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setupCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error('Video or canvas element is not initialized');
      return null;
    }

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    return { video, canvas };
  }, [videoRef, canvasRef]);

  const captureImage = useCallback(() => {
    const elements = setupCanvas();
    if (!elements) return null;

    const { canvas, video } = elements;
    const context = canvas.getContext('2d');

    if (!context) return null;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }, [setupCanvas]);

  const getWebCamImage = useCallback(() => {
    return captureImage();
  }, [captureImage]);

  return {
    videoRef,
    canvasRef,
    getWebCamImage,
  };
};
