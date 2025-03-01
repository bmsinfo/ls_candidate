import React from 'react';

import { MonitorX } from 'lucide-react';

export const ScreenSharingWarning: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grayscale-light rounded-md">
      <div className="max-w-md w-full bg-white border rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <MonitorX className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Screen Sharing Not Supported
        </h2>
        <p className="text-gray-600 mb-4">
          Your current device or browser doesn&apos;t support screen sharing.
          Please try accessing this feature on a desktop or laptop using one of
          these supported browsers:
        </p>
        <ul className="text-left text-gray-600 mb-6 space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Google Chrome
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Microsoft Edge
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Brave Browser
          </li>
        </ul>
        <div className="text-sm text-gray-500">
          For the best experience, please switch to a supported platform.
        </div>
      </div>
    </div>
  );
};
