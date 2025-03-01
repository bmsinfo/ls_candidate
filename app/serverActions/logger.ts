'use server';

import { cookies } from 'next/headers';

import axios from 'axios';

import {
  BASE_URL,
  COOKIE_SESSION_TOKEN,
  WEB_APP_VERSION,
} from '@/lib/constants';
import { LogDetails } from '@/lib/logger';

export const createLogToBackend = async (
  session: number,
  log: Partial<LogDetails>,
) => {
  const payload = {
    session,
    log: {
      ...log,
      version: WEB_APP_VERSION,
      created_at: new Date().toISOString(),
    },
  };
  console.log('payload---', payload); // Log the payload to the cons
  try {
    const url = `${BASE_URL}/frontend-log/`;

    console.log('createLogToBackend -----', { payload });
    await axios.post(url, payload);
  } catch (error) {
    console.error('Failed to create log for backend:', error);
  }
};

export const sendLogToBackend = async (
  sessionLocal: number | undefined | string,
  log: Partial<LogDetails>,
) => {
  let session = sessionLocal;

  if (!session) {
    const cookieStore = cookies();
    session = cookieStore.get(COOKIE_SESSION_TOKEN)?.value;
    console.log('session', session);
  }

  if (!session) {
    console.error('Session not found in cookies or local session');
    return;
  }

  const payload = {
    log: {
      ...log,
      version: WEB_APP_VERSION,
      created_at: new Date().toISOString(),
    },
  };
  console.log('sendLogToBackend -----', { payload });

  try {
    // TODO: use in future
    // const url = `${BASE_URL}/frontend-log/${session}/`;
    // await axios.patch(url, payload);
    return;
  } catch (error) {
    console.error('Failed to send log to backend:', error);
  }
};
