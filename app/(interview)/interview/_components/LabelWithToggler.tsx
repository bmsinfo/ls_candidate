import React from 'react';

import { Maximize2, Minimize2 } from 'lucide-react';

import { useStore } from '@/app/store/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import DeepgramToggler from './DeepgramToggler';

const LabelWithToggler = ({
  children,
  variant = 'desktop',
}: {
  children?: React.ReactNode;
  variant?: 'mobile' | 'desktop';
}) => {
  const { setCollpseAnswerSection, collpseAnswerSection } = useStore(
    (state) => state,
  );

  return (
    <div className="flex justify-between items-center">
      <Label htmlFor="answer-textarea-id">Your Answer</Label>
      <div className="flex gap-3 items-center">
        {variant === 'desktop' && <DeepgramToggler />}

        {children}
        <Button
          size="icon"
          variant="ghost"
          className="border w-7 h-7"
          onClick={() => setCollpseAnswerSection(!collpseAnswerSection)}
          aria-label={collpseAnswerSection ? 'Expand' : 'Collapse'}>
          {!collpseAnswerSection ? (
            <Maximize2 size={16} />
          ) : (
            <Minimize2 size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LabelWithToggler;
