import React, { useState } from 'react';

import { ChevronsUpDown, CircleHelp } from 'lucide-react';

import AdditionalInstructions from '@/app/(interview)/interview/_components/AdditionalInstructions';
import VoiceCommands from '@/app/(interview)/interview/_components/VoiceCommands';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

const HelpMeButton = React.memo(() => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
          className="rounded-full"
          size="icon">
          <CircleHelp className="text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 z-10 h-fit p-0 ml-3 mb-3 bg-background shadow-lg"
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}>
        <VoiceCommands />
        <Collapsible className="mb-3">
          <div className="flex items-center gap-1 p-3">
            <h3 className="font-medium">Additional Instructions</h3>
            <CollapsibleTrigger>
              <ChevronsUpDown className="h-4 w-4" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <AdditionalInstructions hideHeader />
          </CollapsibleContent>
        </Collapsible>
      </PopoverContent>
    </Popover>
  );
});

HelpMeButton.displayName = 'HelpMeButton';

export default HelpMeButton;
