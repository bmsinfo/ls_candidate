import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

export const useTimedNotification = (
  redirectTo = '/interview/v0',
  timeoutDuration = 2 * 60 * 1000,
) => {
  const { push } = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.error('Error occurred. Redirecting...');
      push(redirectTo);
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [push, redirectTo, timeoutDuration]);
};
