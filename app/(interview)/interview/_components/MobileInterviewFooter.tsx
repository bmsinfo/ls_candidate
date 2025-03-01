'user client';

import React, { useState } from 'react';

import VoiceCommandModal from '@/app/modals/VoiceCommandModal';
import { useStore } from '@/app/store/store';
import { Button } from '@/components/ui/button';

interface MobileInterviewFooterProps {
  handleAvatarVisibility?: (visible: boolean) => void;
}

const MobileInterviewFooter: React.FC<MobileInterviewFooterProps> = ({
  handleAvatarVisibility,
}) => {
  const { currentQuestion } = useStore((state) => state);
  const [open, setOpen] = useState(false);

  return (
    <div
      id="interview-header"
      className="w-full flex flex-row-reverse justify-between gap-4 z-10 bg-primary-dodger-light p-3 rounded-t-lg">
      {currentQuestion && (
        <Button
          className="text-white self-end"
          onClick={() => handleAvatarVisibility?.(false)}>
          Answer Now
        </Button>
      )}

      <VoiceCommandModal open={open} onOpenChange={(open) => setOpen(open)} />
    </div>
  );
};

MobileInterviewFooter.displayName = 'MobileInterviewFooter';

export default React.memo(MobileInterviewFooter);
