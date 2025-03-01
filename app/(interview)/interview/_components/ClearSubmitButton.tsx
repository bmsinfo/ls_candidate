'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { RingLodderIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const ClearSubmitButton = ({
  onSubmitHandler,
  isSubmitBtnDisabled,
  isClearBtnDisabled,
  isSubmiting,
  clearHandler,
  classNames,
}: {
  onSubmitHandler?: () => void;
  isSubmitBtnDisabled?: boolean;
  isSubmiting?: boolean;
  isClearBtnDisabled?: boolean;
  clearHandler: () => void;
  classNames?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center w-full justify-between md:justify-end gap-2',
        classNames,
      )}>
      <Button
        type="reset"
        variant="outline"
        onClick={clearHandler}
        className="w-full md:w-fit"
        disabled={isClearBtnDisabled || isSubmiting}>
        Clear
      </Button>
      <Button
        id="tour-guide-submit"
        onClick={onSubmitHandler}
        disabled={isSubmitBtnDisabled || isSubmiting}
        className="flex gap-2 w-full md:w-fit items-center justify-center md:justify-end text-white">
        Submit Answer
        {isSubmiting && <RingLodderIcon />}
      </Button>
    </div>
  );
};

export default ClearSubmitButton;
