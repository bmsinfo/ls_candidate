'use server';

import axios from 'axios';

import { BASE_URL, TOKEN_SECRET_KEY } from '@/lib/constants';
import { ActionResponse, handleServerActionError } from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';
import { filterEmptyArrays, getErrorMessage } from '@/lib/utils';

import { DecodeTokenResponse, FormState } from '../types/common';

var jwt = require('jsonwebtoken');

function getJwtSecretKey() {
  const secret = TOKEN_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT Secret key is not matched');
  }
  return new TextEncoder().encode(secret);
}

export const decodeToken = async (
  token: string,
): Promise<DecodeTokenResponse> => {
  try {
    const encodedSecret = getJwtSecretKey();
    var decoded = jwt.verify(token, encodedSecret);
    console.log({ decoded });

    return {
      data: {
        candidate_token: decoded.candidate_token,
      },
    };
  } catch (error) {
    console.log('### decode error ##', error + '');

    const errorMessage = getErrorMessage(error);
    console.log({ errorMessage });
    return {
      error: {
        detail: 'Something went wrong. Please try again later.',
        // message: resp.statusText,
        // statusCode: resp.status,
        // statusText: resp.statusText,
        title: errorMessage ?? 'JsonWebTokenError',
      },
    };
  }
};

export const validateInvite = async (
  token: string,
): Promise<ActionResponse<ValidateInviteResponse>> => {
  try {
    const url = `${BASE_URL}/validate-invite/`;
    const response = await axios.post(url, { candidate_token: token });

    const data = await response.data;
    console.log({ data });

    return {
      data: {
        candidate_email: data?.detail?.candidate_email,
        candidate_uid: data?.detail?.candidate_uid,
      },
    };
  } catch (error) {
    return handleServerActionError(error, 'validate_invite_error');
  }
};

export const sendOTP = async (
  body: SendOTPFormType,
): Promise<ActionResponse<sendOTPResponse>> => {
  try {
    const restructureBody = {
      candidate_uid: body.candidate_uid,
      email: body.candidate_email,
    };
    const url = `${BASE_URL}/send-otp/`;
    const response = await axios.post(`${url}`, restructureBody);

    const data = await response.data;
    console.log({ sendOtp: data });

    return data;
  } catch (error) {
    return handleServerActionError(error, 'send_otp_error');
  }
};

export const verifyOTP = async (
  body: VerifyOTPType,
): Promise<ActionResponse<VerifyOTPResponseInterface>> => {
  try {
    const url = `${BASE_URL}/verify-otp/`;
    const response = await axios.post(url, body);
    const data = await response.data;

    console.log({ data });
    return data;
  } catch (error) {
    return handleServerActionError(error, 'verify_otp_error');
  }
};

export const addProfiles = async (body: {
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
    console.log({ jsonbody: JSON.stringify(body) });
    console.log({ body });

    const { job_posting_id, candidate_id } = body;
    const filteredBody = filterEmptyArrays(body);
    console.log({ filteredBodySS: JSON.stringify(filteredBody) });

    if (!job_posting_id || !candidate_id) {
      throw new Error('*** missing (job_posting_id, candidate_id) ***');
    }
    const url = `${BASE_URL}/social-profiles-certificates/`;
    const response = await axios.patch(url, filteredBody);
    const data = await response.data;
    console.log({ data });
    return data;
  } catch (error) {
    return handleServerActionError(error, 'profile_error');
  }
};
