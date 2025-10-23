import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef } from 'react';

import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';

interface TrackingConfig {
  eventName: AnalyticEvent;
  delayMillis?: number;
  transform: (data: any) => Record<string, string | number | boolean>;
}

export const useDebouncedTracking = ({
  eventName,
  delayMillis = 1000,
  transform,
}: TrackingConfig) => {
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const debouncedTrack = useMemo(
    () =>
      debounce((data: any) => {
        if (data == null) {
          return;
        }
        const trackingData = transformRef.current(data);
        trackClientEvent(eventName, trackingData);
      }, delayMillis),
    [delayMillis, eventName]
  );

  useEffect(() => {
    return () => {
      debouncedTrack.cancel();
    };
  }, [debouncedTrack]);

  return debouncedTrack;
};
