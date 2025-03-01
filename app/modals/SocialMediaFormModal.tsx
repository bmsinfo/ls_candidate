import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, X } from 'lucide-react';
import { z } from 'zod';

import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import {
  ALL_WEB,
  CERTIFICATES,
  FACEBOOK,
  FITMENT_QUESTION_PAGE,
  GITHUB,
  INVITE_SENT,
  JOB_DESCRIPTION_PAGE,
  LINKEDIN,
  ONLY_INTERVIEW_WEB,
  PRE_SCREENING_PASSED,
  STACKOVERFLOW,
  WA_WEB,
} from '@/lib/constants';
import { loggerAPI } from '@/lib/logger';
import { getErrorMessage, sleep } from '@/lib/utils';
import { urlOrNullOrEmptyString } from '@/lib/validations';

import { addProfiles } from '../serverActions/candidate';
import { useStore } from '../store/store';

export default function SocialMediaFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { push } = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const toggleSocialMediaModal = useStore(
    (state) => state.updateSocialMediaModal,
  );
  const should_ask_fitment_questions = false;

  const { job_posting_uid, org_name, flow_type } = useStore(
    (state) => state.interview,
  );
  const candidate_id = useStore((state) => state.interview?.candidate_uid);
  const interview_status = useStore(
    (state) => state.interview?.interview_status,
  );

  const fitment_questions = [];
  const isIlankCompany = /^ilink(?:\s|)digital(?:\s|)(?:test)?$/i.test(
    org_name ?? '',
  );

  const socialMediaFormValidation = z.object({
    [GITHUB]: z.string().nullable(),
    [STACKOVERFLOW]: z.string().nullable(),
    [FACEBOOK]: urlOrNullOrEmptyString,
    [LINKEDIN]: isIlankCompany
      ? z
          .string()
          .startsWith('https://', {
            message: 'Must provide secure URL which starts with https://',
          })
          .url()
      : z.string().optional(), // make url required and validate as URL

    [CERTIFICATES]: z.array(
      z.object({
        certificate_name: z.string(),
        link: isIlankCompany
          ? z
              .string()
              .startsWith('https://', {
                message: 'Must provide secure URL which starts with https://',
              })
              .url()
          : z.string().optional(), // make url required and validate as URL

        certifying_authority: z.string(),
      }),
    ),
  });
  const form = useForm<z.infer<typeof socialMediaFormValidation>>({
    resolver: zodResolver(socialMediaFormValidation),
    defaultValues: {
      [GITHUB]: '',
      [LINKEDIN]: '',
      [STACKOVERFLOW]: '',
      [FACEBOOK]: '',
      [CERTIFICATES]: [
        {
          certificate_name: '',
          link: '',
          certifying_authority: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: CERTIFICATES,
  });

  const onSubmit = async (
    values: z.infer<typeof socialMediaFormValidation>,
  ) => {
    setIsLoading(true);
    try {
      const linkedinRequired = isIlankCompany && !values.linkedin;
      if (linkedinRequired) {
        form.setError(LINKEDIN, { message: 'LinkedIn profile is required' });
        return;
      }

      // Check if the company name is 'ilikedigital' then make sure that we have at lease one certificate that will has url else we need to make it required
      if (isIlankCompany && values.certificates.every((c) => !c.link)) {
        form.setError(CERTIFICATES, {
          message: ' Please add at least one certificate.',
        });
        return;
      }

      if (values.certificates) {
        values.certificates = values.certificates.filter((c) => c.link);
      }

      // TODO : if componay name is 'ilikedigital' then we need to make sure that we have at lease one certificate that will has url else we need to make it required

      await sleep(2000);
      const body = {
        ...values,
        linkedin: values.linkedin ?? null,
        candidate_id: candidate_id,
        job_posting_id: job_posting_uid,
      };
      await addProfiles(body);

      toast({
        title: 'social media profiles added',
      });
      loggerAPI({
        event: 'social_media_form',
        status: 'submitted',
      });
      // push("/interview");

      // toggleSocialMediaModal(false);
      modalCloseHandler();
    } catch (error) {
      toast({
        title: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing the modal when newOpen is true
    // This prevents closing when clicking outside
    if (newOpen) {
      onClose();
    }
  };

  const modalCloseHandler = () => {
    onClose();

    if (flow_type === ONLY_INTERVIEW_WEB) {
      // skipping fitment questions page
      push('/candidate/interview/permissions');
      return;
    } else if (flow_type === ALL_WEB || flow_type === WA_WEB) {
      // ALL_WEB: fitment and interview on web
      // WA_WEB: fitment on whatsapp and interview on web
      if (interview_status === PRE_SCREENING_PASSED) {
        // skipping the fitment questions page
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Add Your Profiles</DialogTitle>
          <DialogDescription>
            Add your social media profiles here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4">
            <ScrollArea className="flex-grow pr-4  max-h-[480px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXT}
                    control={form.control}
                    label="GitHub Username"
                    name="github"
                    placeholder="Enter your GitHub username"
                  />
                </div>
                <div className="space-y-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXT}
                    control={form.control}
                    label="StackOverflow ID"
                    name="stackoverflow"
                    placeholder="Enter your StackOverflow ID"
                  />
                </div>
                <div className="space-y-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXT}
                    control={form.control}
                    label="Facebook URL"
                    name="facebook"
                    placeholder="Enter your Facebook URL"
                  />
                </div>
                <div className="space-y-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXT}
                    control={form.control}
                    label="LinkedIn URL"
                    name="linkedin"
                    isAstrikRequired={isIlankCompany}
                    placeholder="Enter your LinkedIn URL"
                  />
                </div>
              </div>

              <div className="">
                <div className="flex my-4 items-center justify-between">
                  <Label className=" ">Certifications</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={() =>
                      append({
                        certificate_name: '',
                        link: '',
                        certifying_authority: '',
                      })
                    }>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Certification
                  </Button>
                </div>

                {isIlankCompany && (
                  <span className=" text-sm">
                    <span className=" text-red-500 mr-2">*</span>Salesforce
                    Trailblazer Certification is mandatory
                  </span>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="mt-2 w-full gap-2 flex-col ">
                    <div className="flex items-center space-x-4">
                      <div className=" flex space-x-2">
                        <CustomFormField
                          fieldType={FormFieldType.TEXT}
                          control={form.control}
                          name={`certificates.${index}.certificate_name`}
                          placeholder="Certificate Name"
                        />

                        <CustomFormField
                          fieldType={FormFieldType.TEXT}
                          control={form.control}
                          name={`certificates.${index}.link`}
                          placeholder="Certificate URL"
                          isAstrikRequired={isIlankCompany}
                        />

                        <CustomFormField
                          fieldType={FormFieldType.TEXT}
                          control={form.control}
                          name={`certificates.${index}.certifying_authority`}
                          placeholder="Certificate Authority"
                        />
                      </div>

                      <div className=" ">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          className="w-full border-none">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* // show error for certificates */}
                {form.formState.errors.certificates && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.certificates.message}
                  </p>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <div className="w-full flex justify-end  space-x-4">
                {!isIlankCompany && (
                  <Button
                    onClick={() => {
                      loggerAPI({
                        event: 'social_media_form',
                        status: 'skipped',
                      });
                      modalCloseHandler();
                    }}
                    type="button"
                    className=" bg-red-500">
                    Skip
                  </Button>
                )}
                <SubmitButton
                  className=" self-end items-end justify-end "
                  loadingText="saving..."
                  isLoading={isLoading}>
                  Save
                </SubmitButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
