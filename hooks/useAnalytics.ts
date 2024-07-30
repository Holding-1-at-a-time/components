import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export const useAnalytics = () => {
  const logEvent = useMutation(api.analytics.logEvent);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    logEvent({ eventName, properties });
  }, [logEvent]);

  return { trackEvent };
};