import React from 'react';

import { CompanyInfo } from './CompanyInfo';
import { JobTitle } from './JobTitle';
import Timer from './Timer';

interface DesktopHeaderProps {
  orgName: string;
  orgLogoUrl: string | null;
  jobTitle: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  orgName,
  orgLogoUrl,
  jobTitle,
}) => (
  <div className="hidden md:flex justify-between items-center py-2 border-b px-10">
    <div className="flex items-center gap-8">
      <CompanyInfo orgName={orgName} orgLogoUrl={orgLogoUrl} />
      <JobTitle title={jobTitle} />
    </div>
    <div className="flex items-center justify-center gap-4">
      <Timer />
    </div>
  </div>
);
