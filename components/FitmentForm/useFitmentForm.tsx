import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  getPrescreeningQuestions,
  submitPrescreeningQuestions,
} from '@/app/serverActions/forms';
import { useStore } from '@/app/store/store';
import { createDefaultValues } from '@/components/DynamicForm/utils/defaultValues';
import {
  createDynamicSchema,
  type DynamicFormData,
} from '@/components/DynamicForm/utils/schemaBuilder';
import type { FormConfig } from '@/components/DynamicForm/utils/types';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';

interface FitmentFormState {
  isLoading: boolean;
  error: string | null;
  formConfig: FormConfig | null;
  defaultFormValues: Record<string, any>;
}

const initialState: FitmentFormState = {
  isLoading: true,
  error: null,
  formConfig: null,
  defaultFormValues: {},
};

export const useFitmentForm = () => {
  const { push } = useRouter();
  const [state, setState] = useState<FitmentFormState>(initialState);

  const {
    interview: { job_posting_uid, candidate_uid },
  } = useStore();

  // Create schema based on form config
  const schema = state.formConfig
    ? createDynamicSchema(state.formConfig)
    : null;

  // Initialize form with react-hook-form
  const form = useForm<DynamicFormData>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: state.defaultFormValues,
    mode: 'onChange',
  });

  // Load form configuration
  const loadFormConfig = useCallback(async () => {
    if (!job_posting_uid) return;

    try {
      const config = await getPrescreeningQuestions({
        job_posting_uid,
      });

      if (isErrorResponse(config)) {
        throw new Error(config.message);
      }

      setState((prev) => ({
        ...prev,
        formConfig: config,
        defaultFormValues: createDefaultValues(config),
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      toast.error('Error loading form configuration');
    }
  }, [job_posting_uid]);

  // Handle form submission
  const onSubmit = useCallback(
    async (values: DynamicFormData) => {
      try {
        const submissionData = {
          ...values,
          candidate_uid,
          job_posting_uid,
        };

        const response = await submitPrescreeningQuestions(submissionData);

        loggerAPI({
          event: 'fitment_questions',
          data: response,
          status: response.status as string,
        });

        if (isErrorResponse(response)) {
          toast.error(response.message);
          return;
        }

        toast.success('Prescreening information added');
        loggerAPI({ event: 'fitment_form', status: 'submitted' });
        push('/permissions');
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        loggerAPI({
          event: 'fitment_form',
          status: 'error',
          reason: errorMessage,
        });
        toast.error(errorMessage);
      }
    },
    [candidate_uid, job_posting_uid, push],
  );

  // Handle skipping the form
  const handleSkip = useCallback(() => {
    // loggerAPI({ event: 'fitment_form', status: 'skipped' });
    form.reset();
  }, []);

  // Load form config on mount
  useEffect(() => {
    loadFormConfig();
  }, [loadFormConfig]);

  // Update form values when default values change
  useEffect(() => {
    if (Object.keys(state.defaultFormValues).length > 0) {
      Object.entries(state.defaultFormValues).forEach(([name, value]) => {
        form.resetField(name, { defaultValue: value });
      });
    }
  }, [state.defaultFormValues, form]);

  return {
    form,
    formConfig: state.formConfig,
    onSubmit,
    handleSkip,
    isLoading: state.isLoading,
    error: state.error,
  };
};
