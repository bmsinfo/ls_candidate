import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  getSocialQuestions,
  submitSocialQuestions,
} from '@/app/serverActions/forms';
import { useStore } from '@/app/store/store';
import { createDefaultValues } from '@/components/DynamicForm/utils/defaultValues';
import {
  createDynamicSchema,
  DynamicFormData,
} from '@/components/DynamicForm/utils/schemaBuilder';
import { FormConfig } from '@/components/DynamicForm/utils/types';
import {
  ALL_WEB,
  PRE_SCREENING_PASSED,
  FITMENT_QUESTION_PAGE,
  ONLY_INTERVIEW_WEB,
  WA_WEB,
  BASE_URL,
} from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';

export interface ApiError {
  [key: string]: string;
}

export interface FieldError {
  message: string;
  type: string;
  ref: {
    name: string;
  };
}

export const useProfileForm = () => {
  const { push } = useRouter();
  const [formConfig, setFormConfig] = useState<FormConfig>();
  const [isLoading, setIsLoading] = useState(true);
  const should_ask_fitment_questions = false;
  const fitment_questions = [];
  const {
    interview: { job_posting_uid, flow_type, candidate_uid, interview_status },
  } = useStore();

  const schema = formConfig ? createDynamicSchema(formConfig) : null;
  const defaultValues = formConfig ? createDefaultValues(formConfig) : {};

  const form = useForm<DynamicFormData>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const { setError } = form;

  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        const config = await getSocialQuestions({
          job_posting_uid: job_posting_uid as string,
        });

        if (isErrorResponse(config)) {
          throw new Error(config.message);
        }
        setFormConfig({ sections: config });
      } catch (error) {
        toast.error('Error loading form configuration');
        if (error instanceof Error) {
          setError('root', { type: 'manual', message: error.message });
        } else {
          setError('root', { type: 'manual', message: String(error) });
        }
      } finally {
        setIsLoading(false);
      }
    };

    job_posting_uid && loadFormConfig();
  }, [job_posting_uid]);

  const handleNavigateAfterSubmit = () => {
    if (flow_type === ONLY_INTERVIEW_WEB) {
      push('/candidate/interview/permissions');
      return;
    }

    if (flow_type === ALL_WEB || flow_type === WA_WEB) {
      if (interview_status === PRE_SCREENING_PASSED) {
        push('/candidate/interview/permissions');
      } else if (
        fitment_questions?.length > 0 &&
        should_ask_fitment_questions
      ) {
        push(FITMENT_QUESTION_PAGE);
      } else {
        push('/candidate/interview/permissions');
      }
    } else {
      push('/candidate/interview/permissions');
    }
  };

  // Simulate an API call that might return errors
  const simulateApiCall = (data: FormData): Promise<FormData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            JSON.stringify({
              socialProfiles: {
                'socialProfiles.github': {
                  message: 'Backend Error Github This field is required',
                  type: 'apiError',
                },
                'socialProfiles.linkedin': {
                  message: 'Backend Error Linkedin This field is required',
                  type: 'apiError',
                },
              },
              certifications: [
                {
                  'certifications.0.certificate_name': {
                    message:
                      'backend error first index Certificate Name is required',
                    type: 'apiError',
                  },
                },
                {
                  'certifications.1.link': {
                    message:
                      'backend second index "link" Certificate link is required',
                    type: 'apiError',
                  },
                },
                {
                  'certifications.0.link': {
                    message: 'abbb cccc eeeee ffffff',
                    type: 'apiError',
                  },
                },
              ],
            }),
          ),
        );
        // }
      }, 1000);
    });
  };

  console.log({ errorrrr: form.formState.errors });
  console.log({ JSONerrorrrr: JSON.stringify(form.formState.errors) });

  const onSubmit = async (values: DynamicFormData) => {
    try {
      const body = {
        ...values,
        candidate_uid: candidate_uid,
        job_posting_uid: job_posting_uid,
      };
      // const respondse = await simulateApiCall(body);
      // console.log({ respondse });
      const response = await submitSocialQuestions(body);

      if (isErrorResponse(response)) {
        console.log({ errrrorApi: response });
        toast.error(response.message);
        // TODO: if got error as json object for field validition then we need to throw error
        throw new Error(response.message);
      }
      console.log({ socialQuestion: response });
      toast.success('Profile information added');
      loggerAPI({ event: 'profile_form', status: 'submitted' });

      // handleNavigateAfterSubmit();
    } catch (error) {
      if (error instanceof Error) {
        const apiErrors = JSON.parse(error.message) as ApiError;
        Object.entries(apiErrors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((error, arrayIndex) => {
              Object.entries(error).forEach(([subKey, subValue]) => {
                const fieldError = subValue as FieldError;
                setError(`${subKey}` as any, {
                  type: fieldError.type,
                  message: fieldError.message,
                });
              });
            });
          } else {
            Object.entries(value).forEach(([subKey, subValue]) => {
              const fieldError = subValue as any;
              setError(`${subKey}` as any, {
                type: fieldError.type,
                message: fieldError.message,
              });
            });
          }
        });
      }
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleSkip = () => {
    loggerAPI({ event: 'profile_form', status: 'skipped' });
    handleNavigateAfterSubmit();
  };

  return {
    form,
    formConfig,
    onSubmit,
    handleSkip,
    isLoading,
  };
};
