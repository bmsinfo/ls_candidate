import React from 'react';

import Image from 'next/image';

interface JobTitleProps {
  title: string;
  variant?: 'mobile' | 'desktop';
}

export const JobTitle: React.FC<JobTitleProps> = ({
  title,
  variant = 'desktop',
}) => {
  if (variant === 'mobile') {
    return <h2 className="text-base text-grayscale font-semibold">{title}</h2>;
  }

  return (
    <div className="flex items-center p-3 rounded bg-blue-50">
      <Image src="/icons/bag.svg" width={18} height={18} alt="job icon" />
      <h2 className="text-sm ml-2 mt-1">Job Title: {title}</h2>
    </div>
  );
};
