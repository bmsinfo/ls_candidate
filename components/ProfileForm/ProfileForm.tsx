import React, { useState } from 'react';

import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { FormSection } from '../DynamicForm/FormSection';
import { RingLodderIcon } from '../ui/icons';
import ProfileHeader from './Header';
import { useProfileForm } from './useProfileForm';

export default function ProfileForm({
  onSkip,
  onNext,
}: {
  onSkip: () => void;
  onNext: () => void;
}) {
  const { form, formConfig: config, onSubmit, isLoading } = useProfileForm();

  const handleSubmit = async (values: any) => {
    console.log({ profile: values });
    try {
      const resp = await onSubmit(values);
      console.log({ resp });
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <ProfileHeader />

      <Separator className="hidden md:block h-[1px] " />

      {isLoading && (
        <div className="p-6 my-10 items-center justify-center flex flex-col gap-4">
          <RingLodderIcon className=" size-10" color="#307BF7" />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid gap-4 px-4 md:py-4 md:p-6">
          {config?.sections?.map((section) => (
            <React.Fragment key={section.id}>
              <FormSection
                section={section}
                control={form.control}
                errors={form.formState.errors}
              />
            </React.Fragment>
          ))}
          <Separator className="my-3 h-[1px]" />
          <div className="w-full flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onSkip}
              type="button"
              className="font-16-24-600 h-11 text-accent-red border-accent-red hover:bg-transparent hover:text-accent-red">
              Skip
            </Button>

            <SubmitButton
              className="font-16-24-600 h-11"
              loadingText="saving..."
              isLoading={isLoading}>
              Continue
            </SubmitButton>
          </div>
        </form>
      </Form>
    </>
  );
}
