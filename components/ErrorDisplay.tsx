// components/ErrorDisplay.tsx
import React, { FC } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { CircleAlertIcon } from './ui/icons';

interface ErrorDisplayProps {
  error: ErrorResponse | null;
  defaultMessage?: string;
}

export interface ErrorResponse {
  detail?: string;
  statusCode?: number;
  statusText?: string;
  name?: string;
  message?: string;
  title?: string;
}

const formatError = (
  error: ErrorResponse | null,
  defaultMessage: string = 'Something went wrong',
) => {
  const { detail, statusCode, statusText, name, message, title } = error || {};

  const description = message ?? detail ?? defaultMessage;

  return { title, description };
};

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  defaultMessage = 'Something went wrong',
}) => {
  console.log({ error });
  const { title, description } = formatError(error, defaultMessage);

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          <CircleAlertIcon className="h-8 w-8 text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
