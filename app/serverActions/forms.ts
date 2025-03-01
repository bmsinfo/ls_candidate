'use server';

import axios from 'axios';

import { BASE_URL } from '@/lib/constants';
import { ActionResponse, handleServerActionError } from '@/lib/error-handling';
import { getErrorMessage } from '@/lib/utils';

export const getPrescreeningQuestions = async ({
  job_posting_uid,
}: {
  job_posting_uid: string;
}) => {
  try {
    const url = `${BASE_URL}/job-postings/${job_posting_uid}/prescreening-settings/`;
    console.log({ url });

    const resp = await axios.get(url);
    const data = await resp.data;
    return data;
  } catch (error) {
    return handleServerActionError(error, 'pre_screening_error');
  }
};

export async function submitPrescreeningQuestions(reqBody: {
  job_posting_uid: string;
  candidate_uid: string;
}): Promise<ActionResponse<PreScreeningResponse>> {
  const { job_posting_uid, candidate_uid, ...rest } = reqBody;
  const url = `${BASE_URL}/candidates/${candidate_uid}/prescreening-answers/`;

  console.log({ rest });

  try {
    const response = await axios.post(url, rest);
    const data = await response.data;
    console.log({ data });
    return data;
  } catch (error: any) {
    return handleServerActionError(error, 'pre_screening_error');
  }
}

export const getSocialQuestions = async ({
  job_posting_uid,
}: {
  job_posting_uid: string;
}) => {
  try {
    const url = `${BASE_URL}/job-postings/${job_posting_uid}/social-profiles-certificates-settings/`;

    const resp = await axios.get(url);
    const data = await resp.data;
    return data;
  } catch (error) {
    return handleServerActionError(error, 'profile_error');
    // throw new Error(getErrorMessage(error));
  }
};

export const submitSocialQuestions = async (body: {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | undefined
    | null
    | { [key: string]: any };
}) => {
  try {
    const { job_posting_uid, candidate_uid, ...rest } = body;
    const url = `${BASE_URL}/social-profiles-certificates/`;
    console.log({ body });

    const resp = await axios.patch(url, body);
    const data = await resp.data;

    return data;
  } catch (error) {
    return handleServerActionError(error, 'profile_error');
  }
};
