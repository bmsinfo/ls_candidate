'use client';

import React from 'react';

import Image from 'next/image';

interface AlertBoxProps {
  title: string;
  description: string;
  className?: string;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  title,
  description,
  className = '',
}) => {
  if (!title || !description) {
    return null;
  }
  return (
    <div
      className={`${className} bg-accent-red-background text-center flex flex-col items-center gap-2 rounded-[6px] px-4 py-3 text-base text-grayscale-gray`}>
      <h3 className="text-accent-red flex items-center w-full justify-center gap-1 font-semibold">
        <Image
          src="/icons/warningIcon.svg"
          alt="warningIcon"
          width={24}
          height={24}
        />
        {title}
      </h3>
      <p>{description}</p>
    </div>
  );
};

export default AlertBox;
