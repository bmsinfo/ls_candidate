import React from 'react';

interface ErrorMessageProps {
  message?: string;
}
export const ErrorMessage = React.memo(function ErrorMessage({
  message,
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p className="text-accent-red text-[0.7rem] font-normal mt-1">{message}</p>
  );
});
