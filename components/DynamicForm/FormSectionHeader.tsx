import React from 'react';

import Image from 'next/image';

import { FormSectionConfig } from '@/components/DynamicForm/utils/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormSectionHeaderProps {
  section: FormSectionConfig;
  canAddMore: boolean;
  onAdd: () => void;
}

export const FormSectionHeader = ({
  section,
  canAddMore,
  onAdd,
}: FormSectionHeaderProps) => {
  return (
    <div
      className={cn('flex items-center justify-between', {
        'my-4': section?.title,
      })}>
      {section?.title && (
        <Label className="font-18-28-600">{section.title}</Label>
      )}

      {section?.isRepeatable && canAddMore && (
        <Button
          type="button"
          variant="nohover"
          size="sm"
          className="bg-transparent"
          onClick={onAdd}>
          <Image src="/icons/plus.svg" alt="plus icon" width={20} height={20} />

          <span className="font-14-20-600 text-primary ml-2">
            Add {section.title || 'Entry'}
          </span>
        </Button>
      )}
    </div>
  );
};
