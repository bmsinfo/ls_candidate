'use client';

import React, { useMemo } from 'react';

interface VideoGridProps {
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
}

export default function VideoGrid({
  children,
  className = '',
}: VideoGridProps) {
  const gridClassName = useMemo(() => {
    const count = React.Children.count(children);

    switch (count) {
      case 1:
        return 'grid-cols-1 grid-rows-1 ';
      case 2:
        return 'grid-cols-1 grid-rows-2 ';
      case 3:
        return 'grid-cols-2 grid-rows-2 [&>*:last-child]:col-span-2 ';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 5:
        return 'grid-cols-2 grid-rows-3 [&>*:nth-child(3)]:col-span-2';
      case 6:
        return 'grid-cols-3 grid-rows-2';
      default:
        return 'grid-cols-3 grid-rows-[auto_auto] auto-rows-[1fr]';
    }
  }, [children]);

  return (
    <div className=" p-2 w-full h-full">
      <div className={`grid gap-2 w-full h-full ${gridClassName}`}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="bg-black rounded-md aspect-video w-full h-full">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
