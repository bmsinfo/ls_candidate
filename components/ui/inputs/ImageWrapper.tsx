import React from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ImageWrapperProps {
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  className?: string;
}

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  src,
  alt,
  width = 24,
  height = 24,
  className,
}) => {
  if (!src) return null;

  return (
    <Image
      src={src}
      height={height}
      width={width}
      alt={alt || 'icon'}
      className={cn('ml-3', className)}
    />
  );
};
