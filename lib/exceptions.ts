// Custom error classes for different types of errors
export class BaseError extends Error {
  status: number;
  isError: boolean;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.isError = true;
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string, status: number = 401) {
    super(message, status);
    this.name = 'AuthenticationError';
  }
}

export class OTPError extends BaseError {
  constructor(message: string, status: number = 400) {
    super(message, status);
    this.name = 'OTPError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class APIError extends Error {
  public status: number;
  public responseText: string;

  constructor(message: string, status: number, responseText: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.responseText = responseText;
  }
}
// throw new APIError(
//   `API request failed with status ${response.status}`,
//   response.status,
//   errorText
// );
