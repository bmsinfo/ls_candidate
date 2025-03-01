'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import moment from 'moment';
import { toast } from 'sonner';

import RingLoader from '@/components/RingLoader';
import UnexpectedError from '@/components/ui/UnexpectedError';
import useAvatar from '@/hooks/useAvatar';
import useRequiredData from '@/hooks/useRequiredData';
import { useStartInterviewSession } from '@/hooks/useStartInterviewSession';
import { AvatarMode } from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { useMediaPermission } from '@/providers/MediaProvider';

import { patchSession } from '../serverActions/interview';
import { useStore } from '../store/store';
import { MobilePermissionModal } from './MobilePermissionModal';

const interviewRoutes = {
  [AvatarMode.NONE]: '/interview/v0', // no avatar
  [AvatarMode.SITEPAL]: '/interview/v1', // sitepal
  [AvatarMode.HEYGEN]: '/interview/v1', // heygen
};
const ScreenShareModalMobile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState<
    'camera' | 'microphone' | 'complete' | 'error'
  >('camera');
  const { hasRequiredData } = useRequiredData();
  const { push } = useRouter();

  const { org_name, session_uid, candidate_uid, job_posting_uid } = useStore(
    (state) => state.interview,
  );
  const {
    hasMicPermission,
    hasWebcamPermission,
    toggleMicrophone,
    toggleWebcam,
    micError,
    webcamError,
    isRequestingMedia,
    startCameraRecording,
  } = useMediaPermission();

  const handleError = useCallback((error: string) => {
    // setCurrentStep('error');
    console.warn(error);
  }, []);

  const cleanup = useCallback(() => {
    toggleMicrophone();
    toggleWebcam();
    setCurrentStep('error');
  }, [toggleMicrophone, toggleWebcam]);

  const { startInterview } = useStartInterviewSession(handleError, cleanup);
  const { avatarMode } = useAvatar();

  useEffect(() => {
    if (hasWebcamPermission && currentStep === 'camera') {
      setCurrentStep('microphone');
    }

    if (hasMicPermission && currentStep === 'microphone') {
      setCurrentStep('complete');
      handleCameraRecording();
    }
  }, [
    hasMicPermission,
    hasWebcamPermission,
    currentStep,
    startCameraRecording,
  ]);

  const handleCameraPermission = async () => {
    try {
      await toggleWebcam();
    } catch (error) {}
  };

  const handleMicrophonePermission = async () => {
    try {
      await toggleMicrophone();
      await startInterview();
    } catch (error) {}
  };

  const handleCameraRecording = useCallback(async () => {
    try {
      if (!hasRequiredData) {
        throw new Error('Required data is missing');
      }
      setIsLoading(true);

      if (!session_uid || !candidate_uid || !job_posting_uid) {
        throw new Error(
          'session_uid, candidate_uid or job_posting_uid is missing',
        );
      }

      await startCameraRecording(); // Start camera recording

      // Start session
      const response = await patchSession({
        session_uid,
        session_started_at: moment.utc().format(),
      });

      if (isErrorResponse(response)) {
        toast.error(response.message);
        return;
      }

      const route = interviewRoutes[avatarMode];
      push(route);
    } catch (error) {
      toggleMicrophone();
      toggleWebcam();
      toast.error(error + '');
      loggerAPI({
        event: 'camera_recording',
        status: 'error',
        reason: error + '',
      });
    } finally {
      setIsLoading(false);
    }
  }, [hasRequiredData, startCameraRecording]);

  if (currentStep === 'error') {
    return <UnexpectedError />;
  }
  console.log('currentStep', currentStep);

  return (
    <>
      {currentStep === 'camera' && (
        <MobilePermissionModal
          type="camera"
          hasError={webcamError}
          onRequestPermission={handleCameraPermission}
          isRequestingMedia={isRequestingMedia}
        />
      )}

      {currentStep === 'microphone' && (
        <MobilePermissionModal
          type="microphone"
          hasError={micError}
          onRequestPermission={handleMicrophonePermission}
          isRequestingMedia={isRequestingMedia}
        />
      )}

      {currentStep === 'complete' && (
        <RingLoader text="Please wait, Loading ..." />
      )}
    </>
  );
};

export default ScreenShareModalMobile;
