import { useCallback, useEffect, useRef } from 'react';

import moment from 'moment';

import {
  NO_TIME_USER_LEAVE_CURRENT_TAB,
  TIME_SPENT_OUTSIDE_CURRENT_TAB,
} from '@/lib/constants';
import { getFromLocalStorage, incrementLocalStorageValue } from '@/lib/utils';

const useVisibilityTracking = () => {
  const startTimeRef = useRef(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        startTimeRef.current = performance.now();
      } else {
        const timeSpentOutside = performance.now() - startTimeRef.current;
        incrementLocalStorageValue(NO_TIME_USER_LEAVE_CURRENT_TAB, 0);
        incrementLocalStorageValue(
          TIME_SPENT_OUTSIDE_CURRENT_TAB,
          0,
          timeSpentOutside,
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  console.count('useVisibilityTracking');

  const getTrackingData = useCallback(() => {
    const timeSpentOutside = getFromLocalStorage(
      TIME_SPENT_OUTSIDE_CURRENT_TAB,
    );
    const noTimeUserLeave = getFromLocalStorage(NO_TIME_USER_LEAVE_CURRENT_TAB);

    return {
      timeSpentOutsideCurrentTab: moment.duration(timeSpentOutside).asSeconds(),
      noTimeUserLeaveCurrentTab: noTimeUserLeave,
    };
  }, []);

  return getTrackingData;
};

export default useVisibilityTracking;
