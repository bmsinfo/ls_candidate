import React from 'react';

import { Card } from './ui/card';

const CardWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={`w-full bg-background rounded-md p-7 border-grayscale-light border text-grayscale-dark shadow-none ${className}`}>
      {children}
    </Card>
  );
};

export default CardWrapper;
