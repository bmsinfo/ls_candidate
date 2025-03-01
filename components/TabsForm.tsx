'use client';

import React, { useCallback, useState } from 'react';

import { useUIStore } from '@/app/store/ui-store';
import { FITMENT, PROFILES } from '@/lib/constants';

import CardWrapper from './CardWrapper';
import FitmentForm from './FitmentForm/FitmentForm';
import ProfileForm from './ProfileForm/ProfileForm';
import { ProgressTabs } from './ProgressTabs';
import { StepIndicator } from './StepIndicator';
import { Tabs, TabsContent } from './ui/tabs';

export type TabStep = typeof PROFILES | typeof FITMENT;

export interface StepProps {
  onNext: () => void;
  onSkip: () => void;
}

interface TabContentProps extends StepProps {
  isMobile: boolean;
}
const TabContent: React.FC<TabContentProps> = ({
  isMobile,
  onNext,
  onSkip,
}) => {
  const content = (
    <>
      <TabsContent value={PROFILES}>
        <ProfileForm onSkip={onSkip} onNext={onNext} />
      </TabsContent>
      <TabsContent value={FITMENT}>
        <FitmentForm />
      </TabsContent>
    </>
  );

  if (isMobile) {
    return content;
  }
  return <CardWrapper className="border-none">{content}</CardWrapper>;
};

const TabsForm = () => {
  const { isMobile } = useUIStore((state) => state);

  const [activeTab, setActiveTab] = useState<TabStep>('profiles');

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabStep);
  }, []);

  const handleNext = useCallback(() => {
    setActiveTab(FITMENT);
  }, []);

  const handleSkip = useCallback(() => {
    setActiveTab(FITMENT);
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <ProgressTabs />

      {!isMobile && <StepIndicator currentStep={activeTab} />}

      <TabContent isMobile={isMobile} onNext={handleNext} onSkip={handleSkip} />
    </Tabs>
  );
};

export default TabsForm;
