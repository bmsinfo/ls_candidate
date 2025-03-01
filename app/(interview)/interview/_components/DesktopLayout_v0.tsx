import React from 'react';

import { Mic } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import AnswerSection from './AnswerSection';
import InterviewHeader from './InterviewHeader';
import QuestionWrapper from './QuestionWrapper';
import VoiceCommands from './VoiceCommands';
import WebCamWrapper, { WebCamWrapperRef } from './WebCamWrapper';

interface DesktopLayoutProps {
  webCamReference: React.RefObject<WebCamWrapperRef>;
  collpseAnswerSection: boolean;
  candidateShortName: string;
}

export const DesktopLayout_v0: React.FC<DesktopLayoutProps> = ({
  webCamReference,
  collpseAnswerSection,
  candidateShortName,
}) => (
  <div className="hidden h-screen bg-background md:flex flex-col gap-4 ">
    <InterviewHeader />
    <div className="flex h-header flex-col gap-4 tablet:grid tablet:grid-cols-[1fr_32%]  px-10">
      {/* Left column - Question & Answer box*/}
      <Card className="relative flex flex-col tablet:flex-1 overflow-hidden p-2 rounded-xl h-full border-none bg-transparent ">
        {!collpseAnswerSection && (
          <div className="h-[180px]">
            <QuestionWrapper />
          </div>
        )}
        <div
          className={`overflow-auto transition-all duration-300 ${
            collpseAnswerSection ? 'h-full' : 'h-[calc(100%-180px)]'
          }`}>
          <AnswerSection webCamReference={webCamReference} />
        </div>
      </Card>

      {/* Right column - Avatar & Participants grid */}
      <div className="tablet:grid grid-rows-2 gap-4 h-[200px] p-2 tablet:h-full flex order-first tablet:order-none overflow-hidden">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-2 w-1/2 tablet:w-full h-full">
          <Card
            id="avatar-card"
            className="relative aspect-video w-full h-full overflow-hidden">
            <WebCamWrapper ref={webCamReference} />
            <div className="absolute bottom-2 left-2 flex items-center gap-2 border bg-white px-2 py-1 rounded">
              <Mic className="h-4 w-4 text-black" />
              <span className="text-sm text-black capitalize">
                {candidateShortName}
              </span>
            </div>
          </Card>
        </div>
        {/* Scrollable container for other cards  */}
        <div className="relative w-1/2 tablet:w-full grid grid-cols-1 gap-2 h-full">
          <div
            className={cn(
              'flex  overflow-x-auto h-full tablet:grid tablet:grid-cols-1 tablet:overflow-y-auto tablet:overflow-x-hidden',
            )}>
            <VoiceCommands />
          </div>
        </div>
      </div>
    </div>
  </div>
);
