'use server';

import axios from 'axios';
import moment from 'moment';

import { axiosWithRetry } from '@/lib/axiosHelper';
import { BASE_URL } from '@/lib/constants';
import {
  ActionResponse,
  handleServerActionError,
  handleServerSideValidationError,
} from '@/lib/error-handling';
import { loggerAPI } from '@/lib/logger';

import {
  AnswerInterface,
  AnswerResponseInterface,
  fetchNextQuestionByIdUntilGetQuestionInterface,
  QuestionIdInterface,
  QuestionInterface,
  SessionInterface,
  SessionResponseInterface,
} from '../types/interview';

export const patchSession = async (
  params: SessionInterface,
): Promise<ActionResponse<SessionResponseInterface>> => {
  try {
    console.log('### patch session ###');
    const { session_uid, ...restParams } = params;
    const body = {
      ...restParams,
    };
    console.log({ body, params });
    const url = `${BASE_URL}/sessions/${session_uid}/`;
    const resp = await axios.patch(url, body);
    console.log({ respsession: resp.data });
    loggerAPI({
      message: 'Session patched successfully',
      data: resp?.data,
      status: 'success',
      event: 'patchSession',
    });
    return resp.data;
  } catch (error) {
    return handleServerActionError(error, 'session_error');
  }
};

export const getQuestionById = async ({
  question_uid,
}: {
  question_uid: string;
}): Promise<QuestionInterface> => {
  try {
    console.log('### get question by id###', question_uid);
    const url = `${BASE_URL}/questions/${question_uid}/`;
    const resp: QuestionInterface = await axiosWithRetry({
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log({ resp: resp });
    loggerAPI({
      message: 'Question fetched successfully',
      data: resp,
      status: 'success',
      event: 'getQuestionById',
    });
    return resp;
  } catch (error) {
    loggerAPI({
      message: 'Error while fetching question',
      data: error + '',
      status: 'error',
      event: 'getQuestionById',
    });
    console.log('### get question by id ####', error + '');
    throw error;
  }
};

export const patchAnswer = async (
  params: AnswerInterface,
): Promise<ActionResponse<AnswerResponseInterface>> => {
  try {
    const { uid, answer } = params;
    const body = {
      answer,
      is_asked: true,
      answered_at: moment.utc().format(),
    };
    console.log({ patchBody: body, params });
    const url = `${BASE_URL}/questions/${uid}/`;
    console.log({ url });
    const resp: AnswerResponseInterface = await axiosWithRetry({
      method: 'PATCH',
      url,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log({ respPatch: resp });

    loggerAPI({
      message: 'Answer submitted successfully',
      data: resp,
      status: 'success',
      event: 'patchAnswer',
    });
    return resp;
  } catch (error) {
    return handleServerActionError(error, 'patch_answer_error');
  }
};

export const fetchNextQuestionByIdUntilGetQuestion = async ({
  questionIds,
}: {
  questionIds: string[];
}): Promise<ActionResponse<fetchNextQuestionByIdUntilGetQuestionInterface>> => {
  if (questionIds.length === 0) {
    return handleServerSideValidationError({ error_type: 'question_id_error' });
  }

  const currentQuestionId = questionIds.shift();
  if (!currentQuestionId) {
    return handleServerSideValidationError({ error_type: 'question_id_error' });
  }

  try {
    const question = await getQuestionById({
      question_uid: currentQuestionId,
    });

    if (question.is_asked) {
      throw new Error('Question is already asked'); // this throw is catched in the catch block
    }
    console.log({ guriQeuesti: question });

    return { question, questionIds };
    // return question;
  } catch (error) {
    console.error('Error fetching question:', error + '');

    return fetchNextQuestionByIdUntilGetQuestion({
      questionIds,
    });
  }
};
