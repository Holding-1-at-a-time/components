import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useUnsavedChangesWarning = (isDirty: boolean) => {
  const router = useRouter();

  useEffect(() => {
    const warningText = 'You have unsaved changes - are you sure you want to leave this page?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (!isDirty) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [isDirty, router]);
};