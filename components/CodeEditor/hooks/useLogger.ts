import { useCallback } from 'react';

export const useLogger = () => {
  const updateLogMessage = useCallback((message: string, color = 'green') => {
    const logElement = document.getElementById('log-message-id');
    if (logElement) {
      logElement.innerHTML = `<span style="color: ${color};">${message}</span>`;
    }
  }, []);

  return { updateLogMessage };
};
