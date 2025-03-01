import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import CountdownTimer from '@/components/CountDownTimer';
import SubmitButton from '@/components/SubmitButton';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  COOKIE_SESSION_TOKEN,
  INTERVIEW_GIVEN,
  PRE_SCREENING_FAILED,
} from '@/lib/constants';
import { isErrorResponse } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { getErrorMessage, saveToCookies } from '@/lib/utils';

import { verifyOTP } from '../../app/serverActions/candidate';
import { fetchNextQuestionByIdUntilGetQuestion } from '../../app/serverActions/interview';
import { useStore } from '../../app/store/store';
import {
  fetchNextQuestionByIdUntilGetQuestionInterface,
  InterviewInterface,
} from '../../app/types/interview';
import AlertBox from '../AlertBox';

export default function OTPSection({
  onClose,
  candidate_email,
  candidate_uid,
  redirectOnSubmit = '/job-description',
}: {
  onClose: VoidFunction;
  candidate_email: string;
  candidate_uid: number;
  redirectOnSubmit?: string;
}) {
  const { push } = useRouter();
  const setInterview = useStore((state) => state.setInterview);
  const setAppQuestionIds = useStore((state) => state.setAppQuestionIds);
  const setIsLastQuestion = useStore((state) => state.updateLastQuestion);
  const markTourAsCompleted = useStore((state) => state.markTourAsCompleted);
  const updateTestTime = useStore((state) => state.updateTestTime);

  const updateCurrentQuestion = useStore(
    (state) => state.updateCurrentQuestion,
  );

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState({
    title: '',
    description: '',
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resp = await verifyOTP({
        otp,
        email: candidate_email,
        candidate_uid,
      });
      console.log('resp', resp);

      if (isErrorResponse(resp)) {
        toast.error(resp.message);
        return;
      }

      // if ('detail' in resp) {
      const interviewStatus = resp?.detail?.interview_status;
      if (isInterviewStatusRedirect(interviewStatus)) {
        redirectToInterviewGivenPage(interviewStatus);
        return;
      }

      // configure logger here
      saveToCookies(COOKIE_SESSION_TOKEN, resp.detail?.session_uid);

      await loggerAPI({
        event: 'candidate_verified_with_otp',
        message: 'Candidate verified with otp',
        status: 'verified',
        browser: navigator.userAgent,
        data: {
          interview_status: resp?.detail?.interview_status,
          job_title: resp?.detail?.job_title,
          flow_type: resp?.detail?.flow_type,
          jobposting_id: resp?.detail?.job_posting_uid,
          session_id: resp?.detail?.session_uid,
          candidate_id: resp?.detail?.candidate_uid,
          no_questions: resp?.detail?.n_questions,
          n_followup_questions: resp?.detail?.n_followup_questions,
          test_time: resp?.detail?.test_time,
          question_ids: resp?.detail?.question_uids,
          asked_question_ids: resp?.detail?.asked_question_uids,
          hasAvatar: resp?.detail?.avatar,
        },
      });
      setInterview(resp.detail);

      if (resp?.detail?.question_uids?.length === 0) {
        push('/support');
        return;
      }

      const testTime = resp?.detail?.test_time;
      updateTestTime(testTime);
      const { questionIds, askedQuestionIds, unaskedQuestionIds } =
        getQuestionIds(resp);
      // # contains copy of 'resp.detail.question_ids' and  filter out the question_ids which are already asked ( i.e : 'resp.detail.asked_question_ids')
      setAppQuestionIds(unaskedQuestionIds);

      if (unaskedQuestionIds?.length === 1) {
        setIsLastQuestion(true);
      }

      if (askedQuestionIds?.length === 0) {
        handleFirstTimeInterview(resp);
        push(redirectOnSubmit);
      } else {
        handleResumingInterview(resp, unaskedQuestionIds);
      }

      // TODO: need to move this to some other page
      const currentQuestion = await fetchNextQuestionByIdUntilGetQuestion({
        questionIds: unaskedQuestionIds,
      });

      if (isErrorResponse(currentQuestion)) {
        toast.error(currentQuestion.message);
        return;
      }

      const { question, questionIds: question_ids } =
        currentQuestion as fetchNextQuestionByIdUntilGetQuestionInterface;

      updateCurrentQuestion(question);

      setAppQuestionIds(question_ids as []);
      toast.success('OTP verified successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: any) => {
    const msg = getErrorMessage(error);
    setError(msg);
    toast.error(msg);
  };

  const interviewStatusRedirectSet = new Set([
    INTERVIEW_GIVEN,
    PRE_SCREENING_FAILED,
  ]);
  const isInterviewStatusRedirect = (interviewStatus: string) =>
    interviewStatusRedirectSet.has(interviewStatus);

  const redirectToInterviewGivenPage = (interviewStatus: string) => {
    push(`/interview-given?interview_status=${interviewStatus}`);
  };

  const getQuestionIds = (resp: any) => {
    const {
      question_uids: questionIds,
      asked_question_uids: askedQuestionIds,
    }: InterviewInterface = resp.detail;
    const unaskedQuestionIds = questionIds.filter(
      (id: string) => !askedQuestionIds.includes(id),
    );
    return { questionIds, askedQuestionIds, unaskedQuestionIds };
  };

  const handleFirstTimeInterview = (resp: any) => {
    setInterview({ ...resp?.detail, isResumingInterview: false });
  };

  const handleResumingInterview = (resp: any, unaskedQuestionIds: any) => {
    setInterview({
      ...resp?.detail,
      // question_ids: unaskedQuestionIds, // here we update the  question_ids to the unaskedQuestionIds
      isResumingInterview: true,
    });
    markTourAsCompleted();
    push(`/permissions`);
  };

  const closeHandler = () => {
    onClose();
    setError('');
    setIsLoading(false);
    setOtp('');
  };
  return (
    <div className="font-robot w-full h-auto flex flex-col gap-5">
      <h1 className="font-robot text-2xl font-semibold text-grayscale-dark">
        Enter One Time Password{' '}
      </h1>

      <p className="text-base leading-9 text-left text-grayscale-gray">
        We’ve sent a one - time password (OTP) to {candidate_email}
      </p>
      <AlertBox title={apiError.title} description={apiError.description} />

      <form onSubmit={submit}>
        <div className="flex flex-col w-full max-w-xsm gap-5">
          <InputOTP
            maxLength={6}
            pattern="^[0-9]+$"
            value={otp}
            className="flex items-center w-full justify-between gap-2"
            onChange={(value) => setOtp(value)}>
            {[...Array(6)].map((_, index) => (
              <InputOTPGroup key={index}>
                <InputOTPSlot
                  index={index}
                  className={` ${
                    error ? 'border-red-500 ring-red-500' : 'border-gray-300'
                  }`}
                />
              </InputOTPGroup>
            ))}
          </InputOTP>

          <CountdownTimer onClose={closeHandler} />

          <SubmitButton
            loadingText="verifying..."
            disabled={otp.length !== 6}
            isLoading={isLoading}>
            Verify OTP
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
