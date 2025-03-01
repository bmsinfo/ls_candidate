import React from 'react';

import { Card } from '@/components/ui/card';

import AnswerSection from './AnswerSection';
import InterviewHeader from './InterviewHeader';
import QuestionWrapper from './QuestionWrapper';
import { WebCamWrapperRef } from './WebCamWrapper';

interface MobileLayoutProps {
  webCamReference: React.RefObject<WebCamWrapperRef>;
  collpseAnswerSection: boolean;
}

export const MobileLayout_v0: React.FC<MobileLayoutProps> = ({
  webCamReference,
  collpseAnswerSection,
}) => (
  <div className="h-screen flex flex-col p-2 md:hidden">
    <InterviewHeader />
    <div className="h-header flex-1 relative bg-background flex justify-between flex-col py-2 gap-2">
      <Card className="relative flex flex-col gap-2 tablet:flex-1 overflow-hidden h-full border-none bg-transparent">
        {!collpseAnswerSection && <QuestionWrapper variant="mobile" />}
        <div
          className={`overflow-auto transition-all duration-300 ${
            collpseAnswerSection
              ? 'h-full'
              : 'h-[calc(100%-2rem)] md:h-[calc(100%-180px)]'
          }`}>
          <AnswerSection webCamReference={webCamReference} />
        </div>
      </Card>
    </div>
  </div>
);
