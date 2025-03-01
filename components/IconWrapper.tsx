import Image from 'next/image';

import { cn } from '@/lib/utils';

const IconWrapper = ({
  iconSrc,
  onClick,
  width = 24,
  height = 24,
  className,
}: {
  iconSrc: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <button className={cn('icon-wrapper', className)} onClick={onClick}>
      <Image src={iconSrc} alt="Icon" width={width} height={height} />
    </button>
  );
};

export default IconWrapper;
