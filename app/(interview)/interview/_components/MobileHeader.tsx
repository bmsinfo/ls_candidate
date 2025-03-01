import React, { useState } from 'react';

import Image from 'next/image';

import { CircleHelp } from 'lucide-react';

import VoiceCommandModal from '@/app/modals/VoiceCommandModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AvatarMode } from '@/lib/constants';

import { CompanyInfo } from './CompanyInfo';
import { JobTitle } from './JobTitle';
import Timer from './Timer';
import WebCamWrapper, { WebCamWrapperRef } from './WebCamWrapper';

interface MobileHeaderProps {
  orgName: string;
  orgLogoUrl: string | null;
  jobTitle: string;
  avatar: string;
  webCamReference: React.RefObject<WebCamWrapperRef>;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  orgName,
  orgLogoUrl,
  jobTitle,
  avatar,
  webCamReference,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex md:hidden justify-between gap-1 flex-col items-center">
      <div className="flex items-center justify-between gap-4 bg-primary-dodger-light w-full p-3 rounded-t-lg rounded-b-none ">
        <CompanyInfo orgName={orgName} orgLogoUrl={orgLogoUrl} />

        <Button
          className="rounded-full bg-transparent"
          onClick={() => setOpen(!open)}
          size="icon">
          <CircleHelp className="" />
        </Button>
      </div>
      <div className="flex w-full gap-2">
        <div className="flex items-start flex-col justify-between gap-1 bg-primary-dodger-light w-full p-3 rounded-t-none rounded-b-lg">
          <JobTitle title={jobTitle} variant="mobile" />
          <Timer variant="mobile" />
        </div>
        {avatar === AvatarMode.NONE && (
          <Card
            id="avatar-card"
            className="relative aspect-video w-full h-full overflow-hidden">
            <WebCamWrapper ref={webCamReference} />
          </Card>
        )}
      </div>
      <VoiceCommandModal open={open} onOpenChange={(open) => setOpen(open)} />
    </div>
  );
};
