// components/RegisterServiceWorker.tsx
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

const RegisterServiceWorker: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      const wb = new Workbox('/service-worker.ts');

      wb.register()
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          if (confirm('New content is available! Click OK to refresh.')) {
            window.location.reload();
          }
        }
      });
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;