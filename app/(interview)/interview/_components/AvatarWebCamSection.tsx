import React, { useRef } from 'react';

import { Mic } from 'lucide-react';

import { ScrollIndicator } from '@/components/ScrollIndicator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AvatarWebCamSectionProps = {
  avatar: React.ReactNode;
  webCamComponent: React.ReactNode;
  candidateName: string;
  isVisible?: boolean;
  isDesktop?: boolean;
};

export const AvatarWebCamSection: React.FC<AvatarWebCamSectionProps> = ({
  avatar,
  webCamComponent,
  candidateName,
  isVisible = true,
  isDesktop = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const containerClasses = cn(
    isDesktop
      ? 'tablet:grid grid-rows-2 gap-4 h-[200px] p-2 tablet:h-full flex order-first tablet:order-none overflow-hidden'
      : 'flex flex-col gap-2',
    { hidden: !isVisible },
  );
  const hasMoreThanOneParticipant = false; // TODO: implement in future with real data (Participant count)

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          'grid grid-cols-1 gap-2',
          isDesktop ? 'w-1/2 tablet:w-full h-full' : 'w-full',
        )}>
        <Card
          id="avatar-card"
          className="relative aspect-video w-full h-full overflow-hidden">
          {avatar}
        </Card>
      </div>

      {/* Scrollable container for other cards  */}
      <div className="relative tablet:w-full grid grid-cols-1 gap-2 h-full">
        <div
          ref={scrollContainerRef}
          className={cn(
            'flex  overflow-x-auto h-full tablet:grid tablet:grid-cols-1 tablet:overflow-y-auto tablet:overflow-x-hidden',
            {
              'tablet:grid-cols-[auto,50%] gap-4': hasMoreThanOneParticipant,
            },
          )}
          // style={{ maxHeight: 'calc(100vh - 400px)' }} // TODO: fix this in future add padding for small screens
        >
          <Card className="relative aspect-video w-full h-full overflow-hidden">
            {webCamComponent}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 border bg-white px-2 py-1 rounded">
              <Mic className="h-4 w-4 text-black" />
              <span className="text-sm text-black capitalize">
                {candidateName}
              </span>
            </div>
          </Card>
          {/* TODO : implement in future when we have more than 1 participant */}
          {/* {[...Array(1)].map((_, index) => (
                <Card
                  key={index}
                  className="relative w-full min-h-[150px] flex-none overflow-hidden">
                  <WebCamWrapper ref={webCamReference} />
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <Mic className="h-4 w-4 text-white" />
                    <span className="text-sm text-black">
                      Participant {index + 2}
                    </span>
                  </div>
                </Card>
              ))} */}
        </div>
        <ScrollIndicator containerRef={scrollContainerRef} />
      </div>
    </div>
  );
};
