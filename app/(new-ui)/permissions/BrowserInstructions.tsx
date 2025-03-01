import { useEffect, useState } from 'react';

import { getSystemDetails } from '@/lib/utils';

export type BrowserInfo = {
  name: string;
  os: string;
  device: string;
  browserVersion: string; // Browser version
  osVersion: string; // OS version
  deviceType: string; // Device type (e.g., mobile, tablet, desktop)
  cpu: string; // CPU architecture
};

const getInstructions = (name: string) => {
  switch (name) {
    case 'Chrome_Windows':
    case 'Chrome_Mac OS':
    case 'Edge_Windows':
    case 'Edge_Mac OS':
    case 'Brave_Windows':
    case 'Brave_Mac OS':
    case 'Unknown_Unknown':
      return (
        <>
          <li>
            In the pop-up window, select the &quot;Entire screen tab&quot;.
          </li>
          <li>
            Inside the Entire screen tab, &quot;select the Entire screen&quot;.
          </li>
          <li>Then, Click on &quot;Share&quot; to begin screen sharing</li>
        </>
      );
    case 'Firefox_Windows':
      return (
        <>
          <li>
            In the popup, select &quot;Entire Screen&quot; and then click
            &quot;Allow&quot; to begin screen sharing
          </li>
        </>
      );
    case 'Firefox_Mac OS':
      return (
        <>
          <li>
            In the popup, select &quot;Use operating system settings&quot; and
            then &quot;Allow&quot;
          </li>
          <li>Then click on &quot;Share Entire Screen&quot; button.</li>
        </>
      );
    case 'Safari_Mac OS':
      return (
        <>
          <li>In the popup, select &quot;Allow to Share Screen&quot;</li>
          <li>Then click on &quot;Share Entire Screen&quot; button</li>
        </>
      );
    default:
      return (
        <>
          <li>
            In the pop-up window, select the &quot;Entire screen tab&quot;.
          </li>
          <li>
            Inside the Entire screen tab, &quot;select the Entire screen&quot;.
          </li>
          <li>Then, Click on &quot;Share&quot; to begin screen sharing</li>
        </>
      );
  }
};

export const BrowserInstructions = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({
    name: 'Unknown',
    os: 'Unknown',
    device: 'Unknown',
    browserVersion: 'Unknown',
    osVersion: 'Unknown',
    deviceType: 'Unknown',
    cpu: 'Unknown',
  });

  useEffect(() => {
    const systemDetails = getSystemDetails();
    setBrowserInfo(systemDetails as BrowserInfo);
  }, []);

  const name = `${browserInfo.name}_${browserInfo.os}`;
  console.log({ name });
  return (
    <>
      <p className="text-sm font-semibold mb-2">
        Follow these steps to share your screen with others:
      </p>
      <ol className="list-decimal list-inside space-y-4 text-sm">
        <li>
          Enable your webcam and microphone permissions using the toggles button
          on the right side.
        </li>
        <li>Click the &quot;Share Your Screen&quot; button.</li>
        {getInstructions(name)}
      </ol>
    </>
  );
};
