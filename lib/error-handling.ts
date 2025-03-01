import { AxiosError } from 'axios';

import { OTPError } from './exceptions';
import { getErrorMessage } from './utils';

// Define the error response type
export type ErrorResponse = {
  error_type:
    | 'otp_error'
    | 'send_otp_error'
    | 'verify_otp_error'
    | 'profile_error'
    | 'pre_screening_error'
    | 'validate_invite_error'
    | 'session_error'
    | 'patch_answer_error'
    | 'server_error'
    | 'validation_error'
    | 'not_found'
    | 'internal_error'
    | 'question_id_error'
    | 'api_error';
  message: string;
  status?: number;
  isError?: boolean;
};

// Define success response type
export type SuccessResponse<T> = T;

// Combined response type
export type ActionResponse<T> = ErrorResponse | SuccessResponse<T>;

// Helper type guard to check if response is an error
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error_type' in response
  );
}

export function handleServerActionError(
  error: unknown,
  errorType: ErrorResponse['error_type'],
): ErrorResponse {
  // Convert the error to a safe client response

  if (error instanceof OTPError) {
    console.log(' ^^^^^^^^^^^^^^^^ otp error ^^^^^^^^^^^', error.message);
    return {
      error_type: 'otp_error',
      message: error.message,
      status: error.status,
      isError: error.isError,
    };
  }

  if (error instanceof AxiosError) {
    const status = error?.response?.status;
    // For unexpected errors, return a generic message

    console.error('Server---- message ===>:', error.message);
    console.error('Server--- response data ===>', error?.response?.data);
    console.error('Server---- url ===>', error?.response?.config?.url);
    console.error('Server---- method ===>', error?.response?.config?.method);
    console.error('Server---- statuscode ===>', error?.response?.status);

    // const resp = error?.response?.data;
    // console.log({ resp: JSON.stringify(resp) });

    // console.error(
    //   'Server---- response config data ===>',
    //   error?.response?.config?.data,
    // );
    /*
        ###### valide invite errors ###### : received  in 'error?.response?.data'
        => in case of wrong candidate_token :
        {"error":{"message":"The invitation link has expired. Kindly reachout to HR for assistance."}}
      */

    /*
          ###### send OTP errors ###### : received  in 'error?.response?.data'
          => in case of too many OTP requests :
             "error": { "message": "Too many OTP requests. Please try again later." }
            // message: error.response?.data.error.message, // too man otp request

          => in case of wrong candidate_uid :
           {"error":{"message":{"candidate_uid":["Must be a valid UUID."]}}}

           => in case of valid candidate_uid but wrong email :
           {"error":{"message":"Invalid verification attempt"}}'

           => in case wrong url: not getting any error message
      */

    /*
          ###### verify OTP errors ###### : received  in 'error?.response?.data'
          => in case of wrong otp :
            {"status":"error","message":"Invalid OTP"

          => in case of wrong candidate_uid :
            {"error":{"message":{"candidate_uid":["Must be a valid UUID."]}}}

          => in case of wrong email :
           {"status":"error","message":"Invalid verification attempt"}

          => in case of more than 6 digits otp :
          {"error":{"message":{"otp":["Ensure this field has no more than 6 characters."]}}}

          => in case less than 6 digits otp :  not handled
      */

    /*
        ###### patch answer errors ###### : received  in 'error?.response?.data'
        => in case of wrong question_id :
        {"status":"error","detail":"['“8a93e1c7-9d0c-433b-bb9b-a8ea28d4c46be” is not a valid UUID.']"}
      */
    // };
    const formattedErrorMessage = formatError(error as AxiosError, errorType);

    console.log({ formattedErrorMessage });

    return {
      error_type: errorType,
      message: formattedErrorMessage,
      status: status,
    };
  }

  // console.error('Server action error:', error);
  return {
    error_type: 'internal_error',
    message: getErrorMessage(error) || 'An unexpected error occurred',
  };
}

export function handleServerSideValidationError({
  error,
  error_type,
}: {
  error?: unknown;
  error_type: ErrorResponse['error_type'];
}): ErrorResponse {
  if (error_type === 'question_id_error') {
    return {
      error_type: error_type,
      message: 'Error: Unable to fetch question. Question IDs array is empty.',
    };
  }

  return {
    error_type: error_type,
    message: getErrorMessage(error) || 'An unexpected error occurred',
  };
}

export function formatError(
  error: AxiosError | Error,
  errorType: ErrorResponse['error_type'],
): ErrorResponse['message'] {
  // Handle Axios error responses

  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    // handle if we have data in the response
    // if data is like this : {"candidate_uid":["This field is required."],"job_posting_uid":["This field is required."]}
    // then we need to handle it like :  { "candidate_uid": "This field is required",job_posting_uid: "This field is required"}
    // TODO: handle this case for 'error_type': 'profile_form'
    // if (responseData) {
    //   const data = responseData;
    //   const newData: Record<string, string> = {};
    //   Object.keys(data).forEach((key) => {
    //     newData[key] = data[key][0];
    //   });
    //   // return newData;
    //   return JSON.stringify(newData);
    // }

    // Handle simple error messages
    // for example, if the error is { error: { message: 'Invalid username' } }
    // then we need to return a single string that includes the error message.
    if (
      responseData?.error?.message &&
      typeof responseData.error.message === 'string'
    ) {
      return responseData.error.message;
    }

    // Handle validation errors with nested message objects
    // for example, if the error is { error: { message: { username: ['Invalid username'], email: ['Invalid email'] } } }
    // then we need to returns a single string that includes all the error messages, along with their corresponding key names.
    // and return it as a string
    // for example, 'username: Invalid username, email: Invalid email'

    if (
      responseData?.error?.message &&
      typeof responseData.error.message === 'object'
    ) {
      const errorMessages = Object.entries(responseData.error.message)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          } else {
            return `${key}: ${value}`;
          }
        })
        .join(', ');

      return errorMessages;
    }

    // handle error messages with status and message properties
    // for example, if the error is { status: 'error', message: 'Invalid username' }
    // then we need to return a single string that includes the error message.
    // and return it as a string
    // for example, 'Invalid username'
    if (
      responseData?.status === 'error' &&
      responseData?.message &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message;
    }

    // handle error messages with status and detail properties
    // for example, if the error is { status: 'error', detail: 'Invalid username' }
    // then we need to return a single string that includes the error message.
    // and return it as a string
    // for example, 'Invalid username'
    if (
      responseData?.status === 'error' &&
      responseData?.detail &&
      typeof responseData.detail === 'string'
    ) {
      return responseData.detail;
    }

    // for example, if the error is { status: 'error', detail: ['Invalid uuid for this field'] }
    // then we need to return a single string that includes the error message.
    // and return it as a string
    // for example, 'Invalid uuid for this field'
    if (
      responseData?.status === 'error' &&
      responseData?.detail &&
      Array.isArray(responseData.detail)
    ) {
      return responseData.detail[0];
    }

    if (responseData?.status === 'error' && responseData?.detail) {
      return Array.isArray(responseData.detail)
        ? responseData.detail[0]
        : responseData.detail;
    }
  }

  // Handle generic errors
  // when invalid url is passed
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback error message

  return 'An unexpected error occurred. Please try again later.';
}
