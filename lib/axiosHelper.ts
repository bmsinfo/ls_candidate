import axios, { AxiosError } from 'axios';

export async function axiosWithRetry<T>(
  axiosConfig: any,
  maxRetries: number = 3,
  baseDelay: number = 1000, // Base delay in milliseconds
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    console.log({ attempt });
    try {
      // Try the API call
      const response = await axios(axiosConfig);
      return response.data;
    } catch (error) {
      console.log({ isErrrrrr: axios.isAxiosError(error) });

      //   console.log({ error });

      if (!axios.isAxiosError(error) || !shouldRetry(error)) {
        throw error; // Don't retry non-Axios or non-retryable errors
      }

      attempt++;

      if (attempt >= maxRetries) {
        console.log('<------ Exceeded retry limit ------>');
        throw error; // Exceeded retry limit
      }

      // Calculate delay using exponential backoff: baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt);

      console.log(
        `Retrying API call (Attempt ${attempt}/${maxRetries}) in ${delay}ms...`,
        {
          config: axiosConfig,
        },
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unexpected error in retry logic');
}

// function shouldRetry(error: AxiosError): boolean {
//   // Retry on network errors or 5xx server errors
//   return (
//     !error.response ||
//     (error.response.status >= 500 && error.response.status < 600)
//   );
// }

function shouldRetry(error: AxiosError): boolean {
  return true; // Retry for all errors
}
