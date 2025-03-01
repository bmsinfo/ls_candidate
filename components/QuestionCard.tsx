import * as React from 'react';

import IconWrapper from '@/components/IconWrapper';
import { cn } from '@/lib/utils';

const QuestionCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
QuestionCard.displayName = 'QuestionCard';

const QuestionCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between', className)}
    {...props}
  />
));
QuestionCardHeader.displayName = 'QuestionCardHeader';

const QuestionCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(' text-base font-semibold', className)}
    {...props}
  />
));
QuestionCardTitle.displayName = 'QuestionCardTitle';

const QuestionCardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-center gap-6', className)}
    {...props}
  />
));
QuestionCardActions.displayName = 'QuestionCardActions';

const QuestionCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center h-full justify-between border p-4 rounded-[6px]',
      className,
    )}
    {...props}
  />
));
QuestionCardContent.displayName = 'QuestionCardContent';

const QuestionCardText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(' text-sm tablet:font-20-23-400', className)}
    {...props}
  />
));
QuestionCardText.displayName = 'QuestionCardText';

interface QuestionCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  width: number;
  height: number;
}

const QuestionCardIcon = React.forwardRef<
  HTMLDivElement,
  QuestionCardIconProps
>(({ className, icon, width, height, ...props }, ref) => (
  <div ref={ref} {...props}>
    <IconWrapper
      iconSrc={icon}
      width={width}
      height={height}
      className={cn(className)}
    />
  </div>
));
QuestionCardIcon.displayName = 'QuestionCardIcon';

export {
  QuestionCard,
  QuestionCardHeader,
  QuestionCardTitle,
  QuestionCardActions,
  QuestionCardContent,
  QuestionCardText,
  QuestionCardIcon,
};
