'use client';

import React, { useState } from 'react';

import { FITMENT, PROFILES } from '@/lib/constants';

import CardWrapper from './CardWrapper';
import FitmentForm from './FitmentForm/FitmentForm';
import ProfileForm from './ProfileForm/ProfileForm';
import { ProgressTabs } from './ProgressTabs';
import { StepIndicator } from './StepIndicator';
import { CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export type TabStep = typeof PROFILES | typeof FITMENT;

const TabsFormMobile = () => {
  const [activeTab, setActiveTab] = useState<TabStep>('profiles');

  return (
    <div>
      <Tabs
        defaultValue={PROFILES}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabStep)}
        className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={PROFILES}>Add Profile</TabsTrigger>
          <TabsTrigger value={FITMENT}>Fitment Questions</TabsTrigger>
        </TabsList>
        <TabsContent value={PROFILES}>
          <ProfileForm
            onSkip={() => setActiveTab('fitment')}
            onNext={() => setActiveTab('fitment')}
          />
        </TabsContent>
        <TabsContent value={FITMENT}>
          <FitmentForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsFormMobile;
