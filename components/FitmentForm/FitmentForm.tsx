import React from 'react';

import { FormSection } from '../DynamicForm/FormSection';
import SubmitButton from '../SubmitButton';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { RingLodderIcon } from '../ui/icons';
import { Separator } from '../ui/separator';
import FitementHeader from './FitementHeader';
import { useFitmentForm } from './useFitmentForm';

const FitmentForm = () => {
  const {
    form,
    formConfig: config,
    onSubmit,
    handleSkip,
    isLoading,
    error,
  } = useFitmentForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting fitment questions:', error);
    }
  };

  return (
    <div>
      <FitementHeader />
      <Separator className=" hidden md:block h-[1px]" />
      {error && (
        <div className="p-6 text-red-400 flex flex-col gap-4">
          <p>OOps!something went wrong</p>
          <p> Error: {error}</p>
          <Button
            variant="outline"
            onClick={handleSkip}
            type="button"
            className="font-16-24-600 w-fit">
            Next
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="p-6 my-10 items-center justify-center flex flex-col gap-4">
          <RingLodderIcon className=" size-10" color="#307BF7" />
        </div>
      )}

      {!error && (
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
                  renderFieldsClassName={'gap-8'}
                />
              </React.Fragment>
            ))}
            <Separator className="my-3 h-[1px]" />

            <div className="w-full flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                type="button"
                className="font-16-24-600">
                Clear
              </Button>

              <SubmitButton
                className="font-16-24-600"
                loadingText="saving..."
                isLoading={false}>
                Submit
              </SubmitButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default FitmentForm;
