import React from 'react';
import { ReactNode } from 'react';

const OtpSceenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="short-xs:h-full h-without-header short-md:h-full flex items-center justify-center w-full">
      {children}
    </div>
  );
};

export default OtpSceenLayout;
