import { Response } from 'express';

interface ErrorDetails {
  [key: string]: any;
}

export const handleError = (
  res: Response,
  error: unknown,
  statusCode = 500,
  message = 'Internal server error',
): void => {
  const errorResponse: { message: string; details?: ErrorDetails } = { message };

  const errorDetails = getErrorDetails(error);
  if (errorDetails) {
    errorResponse.details = errorDetails;
  }

  res.status(statusCode).json(errorResponse);
};

 const getErrorDetails = (error: unknown): { [key: string]: any } | undefined => {
  if (error instanceof Error) {
    return { error: error.message };
  } else if (typeof error === 'object' && error !== null) {
    return error as { [key: string]: any };
  } else if (error) {
    return { error: String(error) };
  }
  return undefined;
}