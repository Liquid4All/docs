import { track } from '@vercel/analytics';

import { AnalyticEvent } from '@/lib/analytics';
import { TrackingValueType } from '@/lib/analytics/types';

export const trackClientEvent = (
  event: AnalyticEvent,
  metadata?: Record<string, TrackingValueType>
): void => {
  try {
    // vercel analytics
    track(event, metadata);

    // google analytics
    if (window != null && window.dataLayer != null) {
      window.dataLayer.push({
        event,
        ...metadata,
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};
