'use client';

import { useState } from 'react';

import Link from 'next/link';

import FaqVideoCard from '@/components/FaqVideoCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useTermsNavigation } from '../../../hooks/useTermsNavigation';

export default function TermsAndConditionForm({
  classNames,
}: {
  classNames?: string;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const { handleNavigation } = useTermsNavigation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleNavigation();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* mobile */}
      <div className="bg-primary-dodger-light flex items-center justify-between fixed bottom-0 p-5 w-full md:hidden">
        <FaqVideoCard secondaryButton={true} />
        <Button variant={'nohover'} className="font-20-23-600 rounded p-6">
          Continue
        </Button>
      </div>

      {/* desktop  */}
      <div
        className={cn(
          'items-center justify-end space-x-4 hidden md:flex',
          classNames,
        )}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />

          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I agree to the{' '}
            <Link
              href="/terms-conditions"
              target="_blank"
              className="text-primary underline hover:text-primary/90">
              terms and conditions
            </Link>
          </Label>
        </div>

        <Button
          variant={'nohover'}
          disabled={!isChecked}
          className=" w-32 h-12">
          Continue
        </Button>
      </div>
    </form>
  );
}
