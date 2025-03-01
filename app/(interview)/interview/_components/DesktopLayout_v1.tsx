import React from 'react';

import Thanks from '@/components/Thanks';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import AdditionalInstructions from './AdditionalInstructions';
import AnswerSection from './AnswerSection';
import { AvatarWebCamSection } from './AvatarWebCamSection';
import QuestionWrapper from './QuestionWrapper';
import VoiceCommands from './VoiceCommands';
import { WebCamWrapperRef } from './WebCamWrapper';

type DesktopLayout_v1_SectionProps = {
  avatar: React.ReactNode;
  webCamComponent: React.ReactNode;
  candidateName: string;
  isVisible?: boolean;
  isDesktop?: boolean;
  collpseAnswerSection: boolean;
  isFirstQuestionAskedByAvatar: boolean;
  isSessionEnded: boolean;
  webCamReference: React.RefObject<WebCamWrapperRef>;
};

const DesktopLayout_v1 = ({
  avatar,
  webCamComponent,
  candidateName,
  collpseAnswerSection,
  isVisible,
  webCamReference,
  isFirstQuestionAskedByAvatar,
  isSessionEnded,
}: DesktopLayout_v1_SectionProps) => {
  return (
    <div className="flex h-header flex-col gap-4 tablet:grid tablet:grid-cols-[1fr_32%]  px-10">
      {/* Left column - Question & Answer box*/}

      {isSessionEnded && (
        <Card className="relative flex flex-col tablet:flex-1 overflow-hidden p-2 rounded-xl h-full border-none bg-transparent ">
          <Thanks />
        </Card>
      )}

      <Card
        className={cn(
          'relative flex flex-col tablet:flex-1 overflow-hidden p-2 rounded-xl h-full border-none bg-transparent ',
          {
            hidden: isSessionEnded,
          },
        )}>
        {!isFirstQuestionAskedByAvatar && (
          <div className="flex h-full w-full overflow-auto flex-col gap-10 remove-scrollbar">
            <VoiceCommands />
            <AdditionalInstructions />
          </div>
        )}
        {!collpseAnswerSection && isFirstQuestionAskedByAvatar && (
          <div className="h-[180px]">
            <QuestionWrapper />
          </div>
        )}
        <div
          className={cn(
            `overflow-auto transition-all duration-300 ${
              collpseAnswerSection ? 'h-full' : 'h-[calc(100%-180px)]'
            }`,
            {
              hidden: !isFirstQuestionAskedByAvatar,
            },
          )}>
          <AnswerSection
            webCamReference={webCamReference}
            isFirstQuestionAskedByAvatar={isFirstQuestionAskedByAvatar}
          />
        </div>
      </Card>

      {/* Right column - Avatar & Participants grid */}

      <AvatarWebCamSection
        avatar={avatar}
        webCamComponent={webCamComponent}
        candidateName={candidateName}
        isVisible={isVisible}
        isDesktop={true}
      />
    </div>
  );
};

export default DesktopLayout_v1;
