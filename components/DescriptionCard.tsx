import React from 'react';

import { useUtilStore } from '@/app/store/util-store';
import { sanitize } from '@/lib/sanitize';

import { Separator } from './ui/separator';

const DescriptionCard = ({
  title = 'Intro Message',
  description,
  hasSeparator = true,
}: {
  title: string;
  description: string;
  hasSeparator?: boolean;
}) => {
  const isMobile = useUtilStore((state) => state.isMobile);

  if (!description) {
    return null;
  }

  const descriptionList = sanitize(description);

  return (
    <div>
      {!isMobile && (
        <h1 className="font-24-32-600 text-grayscale-dark">{title}</h1>
      )}
      <div className="font-16-28-400 text-grayscale-dark">
        {descriptionList && (
          <div
            dangerouslySetInnerHTML={{ __html: descriptionList }}
            className="break-words"
          />
        )}
      </div>
      {hasSeparator && <Separator className="my-7" />}
    </div>
  );
};

export default DescriptionCard;
