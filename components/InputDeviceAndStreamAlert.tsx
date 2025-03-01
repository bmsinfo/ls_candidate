'use client';

import React, { useMemo } from 'react';

import { useStore } from '@/app/store/store';
import { ALERT_COLOR } from '@/lib/constants';

const ALERTS = {
  inputDeviceChanged: {
    message: (
      <>
        <span className="md:hidden">
          Input device changed. Please reshare screen.
        </span>
        <span className="hidden md:inline">
          We&apos;ve detected a change in your input devices. Please share your
          entire screen again.
        </span>
      </>
    ),
  },
  webCamStreamStopped: {
    message: (
      <>
        <span className="md:hidden">Camera stopped. Please restart.</span>
        <span className="hidden md:inline">
          We&apos;ve detected that your camera stream has stopped. Please
          restart your camera to continue.
        </span>
      </>
    ),
  },
  screenStreamStopped: {
    message: (
      <>
        <span className="md:hidden">
          Screen stream stopped. Please reshare.
        </span>
        <span className="hidden md:inline">
          We&apos;ve detected that your screen stream has stopped. Please
          reshare your screen to continue.
        </span>
      </>
    ),
  },
};

const InputDeviceAndStreamAlert: React.FC = () => {
  const isInputAudioDeviceChanged = useStore(
    (state) => state.isInputAudioDeviceChanged,
  );
  const isWebCamStreamStopped = useStore(
    (state) => state.isWebCamStreamStopped,
  );
  const isScreenStreamStopped = useStore(
    (state) => state.isScreenStreamStopped,
  );

  const alert = useMemo(() => {
    if (isInputAudioDeviceChanged) return ALERTS.inputDeviceChanged;
    if (isWebCamStreamStopped) return ALERTS.webCamStreamStopped;
    if (isScreenStreamStopped) return ALERTS.screenStreamStopped;
    return null;
  }, [isInputAudioDeviceChanged, isWebCamStreamStopped, isScreenStreamStopped]);

  if (!alert) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 dark:bg-yellow-900 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center justify-center">
            <span className="flex p-2 rounded-lg bg-yellow-200 dark:bg-yellow-800">
              {/* <Icon
                icon="mingcute:alert-fill"
                width={25}
                height={25}
                className="cursor-pointer transition ease-linear hover:scale-125"
                color={ALERT_COLOR}
              /> */}
            </span>
            <p className="ml-3 font-medium text-yellow-900 dark:text-yellow-200 truncate">
              {alert.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputDeviceAndStreamAlert;
