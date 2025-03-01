'use server';

import { HEYGEN_API_KEY } from '@/lib/constants';

export const fetchHeygenAccessToken = async () => {
  try {
    console.log('HEYGEN_API_KEY', HEYGEN_API_KEY);
    const response = await fetch(
      'https://api.heygen.com/v1/streaming.create_token',
      {
        method: 'POST',
        headers: {
          'x-api-key': HEYGEN_API_KEY as string,
        },
      },
    );

    const data = await response.json();
    const token = data.data.token;
    console.log('######### Access Token:', token);

    return token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }

  return '';
};
