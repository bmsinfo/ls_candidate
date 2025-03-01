import React from 'react';

import Thanks from '@/components/Thanks';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import AnswerSection from './AnswerSection';
import { AvatarWebCamSection } from './AvatarWebCamSection';
import MobileInterviewFooter from './MobileInterviewFooter';
import QuestionWrapper from './QuestionWrapper';
import { WebCamWrapperRef } from './WebCamWrapper';

type MobileLayout_v1_SectionProps = {
  avatar: React.ReactNode;
  webCamComponent: React.ReactNode;
  candidateName: string;
  isVisible?: boolean;
  isDesktop?: boolean;
  collpseAnswerSection: boolean;
  isFirstQuestionAskedByAvatar: boolean;
  isSessionEnded: boolean;
  webCamReference: React.RefObject<WebCamWrapperRef>;
  handleAvatarVisibility?: (visible: boolean) => void;
};

const MobileLayout_v1 = ({
  avatar,
  webCamComponent,
  candidateName,
  collpseAnswerSection,
  isVisible,
  webCamReference,
  isFirstQuestionAskedByAvatar,
  isSessionEnded,
  handleAvatarVisibility,
}: MobileLayout_v1_SectionProps) => {
  if (isSessionEnded) {
    return (
      <Card className="relative flex flex-col tablet:flex-1 overflow-hidden p-2 rounded-xl h-full border-none bg-transparent">
        <Thanks />
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2">
      <AvatarWebCamSection
        avatar={avatar}
        webCamComponent={webCamComponent}
        candidateName={candidateName}
        isVisible={isVisible}
        isDesktop={false}
      />

      {!collpseAnswerSection && <QuestionWrapper variant="mobile" />}
      <Card
        className={cn(
          'relative flex flex-col gap-2 tablet:flex-1 overflow-hidden h-full border-none bg-transparent',
          {
            hidden: isVisible,
          },
        )}>
        <div className="flex-1 overflow-auto transition-all duration-300">
          <AnswerSection
            handleAvatarVisibility={handleAvatarVisibility}
            webCamReference={webCamReference}
            isFirstQuestionAskedByAvatar={isFirstQuestionAskedByAvatar}
          />
        </div>
      </Card>

      {isVisible && (
        <MobileInterviewFooter
          handleAvatarVisibility={handleAvatarVisibility}
        />
      )}
    </div>
  );
};

export default MobileLayout_v1;
