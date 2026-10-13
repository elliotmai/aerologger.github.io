import { useEffect, useRef } from 'react';
import { useToast } from '@/context/ToastContext';

/**
 * Watches connectivity and surfaces it via the toast system:
 * a sticky "You're offline" toast while offline, and a brief "Back online"
 * when it returns. Renders nothing itself.
 */
export function NetworkStatus() {
  const { toast, dismiss } = useToast();
  const offlineId = useRef(null);

  useEffect(() => {
    const goOffline = () => {
      if (offlineId.current == null) {
        offlineId.current = toast('You’re offline — changes are saved on this device.', {
          type: 'warning',
          duration: 0,
        });
      }
    };
    const goOnline = () => {
      if (offlineId.current != null) {
        dismiss(offlineId.current);
        offlineId.current = null;
        toast('Back online.', { type: 'success', duration: 2000 });
      }
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    if (!navigator.onLine) goOffline();

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [toast, dismiss]);

  return null;
}
