'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { sendOTP } from '@/app/serverActions/candidate';
import AlertBox from '@/components/AlertBox';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import OTPSection from '@/components/Shared/OTPSection';
import SubmitButton from '@/components/SubmitButton';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { useDevice } from '@/hooks/useDevice';
import { COOKIE_OTP_TOKEN } from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { cn, getErrorMessage, saveToCookies } from '@/lib/utils';
import { SendOTPFormValidation } from '@/lib/validations';

export default function SendOTPForm({
  candidate_email,
  candidate_uid,
}: SendOTPFormType) {
  const { token } = useParams();
  saveToCookies(COOKIE_OTP_TOKEN, token as string);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const { isMobile } = useDevice();
  const [error, setError] = useState({
    title: '',
    description: '',
  });
  const form = useForm<z.infer<typeof SendOTPFormValidation>>({
    resolver: zodResolver(SendOTPFormValidation),
    defaultValues: {
      candidate_email: candidate_email,
    },
  });

  const onSubmit = async (values: z.infer<typeof SendOTPFormValidation>) => {
    setIsLoading(true);
    try {
      const body = {
        candidate_email: values.candidate_email,
        candidate_uid: candidate_uid,
      };
      const response = await sendOTP(body);
      console.log({ response });

      // if ('error' in response && response.error) {
      if (isErrorResponse(response)) {
        toast.error(response.message);
        return;
      }

      setShowOtpSection(true);
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleAccept = (checked: boolean) => {
    setTermsChecked(checked);
    loggerAPI({
      status: 'candidate accepted the terms and conditions',
      browser: navigator.userAgent,
      event: 'terms_and_conditions',
      data: '',
    });
  };

  return (
    <div className="font-robot w-full h-auto flex flex-col gap-5">
      <div className="flex hidden md:flex items-center text-xl leading-6 text-center decoration-none gap-3 font-bold text-blue-dark-electric">
        <Image
          alt="company logo"
          src="/assets/icons/logo.svg"
          width={32}
          height={32}
        />{' '}
        Neuralwaves
      </div>
      {!showOtpSection ? (
        <>
          <h1 className="font-robot text-2xl text-center md:text-left font-semibold text-grayscale-dark">
            Candidate Verification
          </h1>
          <p className="text-base md:leading-9 text-center md:text-left text-grayscale-gray">
            Click Send OTP to receive a one-time password (OTP) to verify your
            account.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AlertBox
                className="mb-2"
                title={error.title}
                description={error.description}
              />

              <div className="flex flex-col gap-5">
                <div className=" text-sm font-normal self-start">Email</div>
                <div className="flex w-full">
                  <CustomFormField
                    fieldType={FormFieldType.TEXT}
                    control={form.control}
                    name="candidate_email"
                    placeholder={candidate_email}
                    disabled
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="terms"
                    className="text-sm font-normal leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <Checkbox
                      id="terms"
                      checked={termsChecked}
                      onCheckedChange={(checked: boolean) =>
                        handleAccept(checked)
                      }
                      className="mr-2"
                    />
                    I agree to the Terms and Conditions and Privacy Policy.{' '}
                    <Link
                      href="/terms-conditions"
                      target={isMobile ? '_self' : '_blank'}
                      className="underline text-primary">
                      Click here
                    </Link>
                  </label>
                </div>
                <SubmitButton
                  loadingText="Sending..."
                  disabled={!termsChecked}
                  isLoading={isLoading}>
                  Send OTP
                </SubmitButton>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <OTPSection
          candidate_email={candidate_email}
          candidate_uid={candidate_uid}
          onClose={() => setShowOtpSection(false)}
        />
      )}
    </div>
  );
}
