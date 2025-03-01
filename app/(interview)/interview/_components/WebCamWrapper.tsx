'use client';

import React, { useEffect, useImperativeHandle, forwardRef } from 'react';

import { useWebCam } from '@/hooks/useWebCam';
import { cn } from '@/lib/utils';
import { useMediaPermission } from '@/providers/MediaProvider';

// Define the types for the exposed methods
export interface WebCamWrapperRef {
  getWebCamImage: () => string | null;
}

interface Props {
  isBlinkIcon?: boolean;
}

// Forward ref to WebCamWrapper
const WebCamWrapper = forwardRef(
  ({ isBlinkIcon = false }: Props, ref: React.Ref<WebCamWrapperRef>) => {
    const { webcamStream } = useMediaPermission();
    const { videoRef, canvasRef, getWebCamImage } = useWebCam();

    // Sync the video stream with the video element
    useEffect(() => {
      if (webcamStream && videoRef?.current) {
        videoRef.current.srcObject = webcamStream;
      }
    }, [webcamStream, videoRef?.current]);

    useImperativeHandle(ref, () => ({
      getWebCamImage,
    }));

    return (
      <div className="w-full h-full relative">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <video
          className={cn('w-full h-full border-none')}
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />
        {videoRef?.current?.srcObject && isBlinkIcon && (
          <div className="absolute top-2 right-2 bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  },
);

WebCamWrapper.displayName = 'WebCamWrapper';

export default React.memo(WebCamWrapper);
