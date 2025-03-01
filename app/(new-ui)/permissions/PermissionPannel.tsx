import React, { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import moment from 'moment';
import { toast } from 'sonner';

import { patchSession } from '@/app/serverActions/interview';
import { useStore } from '@/app/store/store';
import { Button } from '@/components/ui/button';
import { RingLodderIcon } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import useAvatar from '@/hooks/useAvatar';
import useRequiredData from '@/hooks/useRequiredData';
import { AvatarMode } from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { useMediaPermission } from '@/providers/MediaProvider';

import { PermissionControl } from './PermissionController';
import { ScreenSharingWarning } from './ScreenSharingWarning';

const interviewRoutes = {
  [AvatarMode.NONE]: '/interview/v0', // no avatar
  [AvatarMode.SITEPAL]: '/interview/v1', // sitepal
  [AvatarMode.HEYGEN]: '/interview/v1', // heygen
};
const PermissionPannel = () => {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { org_name, session_uid, candidate_uid, job_posting_uid } = useStore(
    (state) => state.interview,
  );
  const { avatarMode } = useAvatar();

  const {
    startScreenShare,
    hasMicPermission,
    hasWebcamPermission,
    toggleMicrophone,
    toggleWebcam,
    micError,
    webcamError,
    isScreenSharingSupported,
    stopScreenShare,
  } = useMediaPermission();
  const { hasRequiredData } = useRequiredData();

  const handleScreenShare = useCallback(async () => {
    try {
      if (!hasRequiredData) {
        throw new Error('Required data is missing');
      }
      setIsLoading(true);

      if (!session_uid || !candidate_uid || !job_posting_uid) {
        throw new Error(
          ' session_uid, candidate_uid or job_posting_uid is missing',
        );
      }
      await startScreenShare();
      // start session
      const response = await patchSession({
        session_uid,
        session_started_at: moment.utc().format(),
      });

      if (isErrorResponse(response)) {
        // throw new Error(response.message);
        toast.error(response.message);
        return;
      }
      // handle navigation to screen share page
      const route = interviewRoutes[avatarMode];
      push(route);
    } catch (error) {
      console.warn({ error });
      stopScreenShare();
      toggleMicrophone();
      toggleWebcam();
      toast.error(error + '');
      loggerAPI({
        event: 'sharescreen',
        status: 'error',
        reason: error + '',
      });
    } finally {
      setIsLoading(false);
    }
  }, [hasRequiredData, startScreenShare]);

  // Show loading state while checking support
  if (isScreenSharingSupported === null) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Checking device compatibility...</p>
      </div>
    );
  }

  // Show warning if screen sharing is not supported
  if (!isScreenSharingSupported) {
    return <ScreenSharingWarning />;
  }

  return (
    <>
      <PermissionControl
        icon={'/icons/webcam.svg'}
        label="Webcam"
        isEnabled={hasWebcamPermission}
        onToggle={toggleWebcam}
        error={webcamError}
      />
      <Separator className="my-2" />
      <PermissionControl
        icon={'/icons/microphone.svg'}
        label="Microphone"
        isEnabled={hasMicPermission}
        onToggle={toggleMicrophone}
        error={micError}
      />
      <Separator className="my-2" />

      <div className="flex items-end justify-end h-full w-full">
        <Button
          variant="nohover"
          onClick={handleScreenShare}
          disabled={!hasWebcamPermission || !hasMicPermission || isLoading}
          size={'lg'}
          className=" rounded-lg w-full text-base font-medium">
          Share Your Screen
          {isLoading && <RingLodderIcon className="ml-2" />}
        </Button>
      </div>
    </>
  );
};

export default PermissionPannel;
