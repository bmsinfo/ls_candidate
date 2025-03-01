import { ErrorResponse } from '@/components/ErrorDisplay';

export type FormState =
  | {
      error?: ErrorResponse;
      message?: string;
      data?: {
        candidate_email: string;
        candidate_uid: number;
      };
    }
  | undefined
  | null;

export type DecodeTokenResponse =
  | {
      error?: ErrorResponse;
      status?: string;
      data?: {
        candidate_token: string;
      };
      //   message?: string;
    }
  | undefined
  | null;
