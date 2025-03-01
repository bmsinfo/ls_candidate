import React, { memo } from 'react';

import FAQModal from '@/app/modals/FAQModal';
import VideoModal from '@/app/modals/VideoModal';

const FaqVideoCard = ({
  secondaryButton = false,
}: {
  secondaryButton?: boolean;
}) => {
  return (
    <div className="flex items-center gap-4">
      <VideoModal />
      <FAQModal secondaryButton={secondaryButton} />
    </div>
  );
};

FaqVideoCard.displayName = 'FaqVideoCard';

export default memo(FaqVideoCard);
