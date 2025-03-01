import { FITMENT, PROFILES } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { TabStep } from './TabsForm';

export interface StepIndicatorProps {
  currentStep: TabStep;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <p className="text-center font-16-24-500 text-grayscale-dark mb-8">
      (
      <span className={cn({ 'opacity-30': currentStep !== PROFILES })}>01</span>
      /<span className={cn({ 'opacity-30': currentStep !== FITMENT })}>02</span>
      )
    </p>
  );
};
