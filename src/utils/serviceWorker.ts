/**
 * Service Worker registration and management utilities
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
}

/**
 * Register service worker
 */
export const registerServiceWorker = (config?: ServiceWorkerConfig): void => {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('Service Worker: Running in development mode');
        });
      } else {
        registerValidServiceWorker(swUrl, config);
      }
    });
  }
};

/**
 * Register valid service worker
 */
const registerValidServiceWorker = (swUrl: string, config?: ServiceWorkerConfig): void => {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker: Registered successfully');
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Service Worker: New content available, please refresh');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Service Worker: Content cached for offline use');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
              if (config && config.onOfflineReady) {
                config.onOfflineReady();
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Service Worker: Registration failed', error);
    });
};

/**
 * Check if service worker is valid
 */
const checkValidServiceWorker = (swUrl: string, config?: ServiceWorkerConfig): void => {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidServiceWorker(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Service Worker: No internet connection, running in offline mode');
    });
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('Service Worker: Unregistered successfully');
      })
      .catch((error) => {
        console.error('Service Worker: Unregistration failed', error);
      });
  }
};

/**
 * Check if app is running offline
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * Listen for online/offline events
 */
export const setupOfflineListener = (
  onOnline?: () => void,
  onOffline?: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('App: Back online');
    if (onOnline) onOnline();
  };

  const handleOffline = () => {
    console.log('App: Gone offline');
    if (onOffline) onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Show update available notification
 */
export const showUpdateAvailableNotification = (): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Update Available', {
      body: 'A new version of the app is available. Please refresh to update.',
      icon: '/vite.svg',
      tag: 'app-update'
    });
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    return await Notification.requestPermission();
  }
  return 'denied';
};

/**
 * Cache contact form data for offline submission
 */
export const cacheContactFormData = async (formData: any): Promise<void> => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('dynamic-v1');
      const request = new Request(`/contact-form-data-${Date.now()}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const response = new Response(JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      await cache.put(request, response);
      console.log('Service Worker: Contact form data cached for offline submission');
    } catch (error) {
      console.error('Service Worker: Failed to cache contact form data', error);
    }
  }
};

/**
 * Trigger background sync for contact form
 */
export const triggerContactFormSync = (): void => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('contact-form-sync');
    }).catch((error) => {
      console.error('Service Worker: Background sync registration failed', error);
    });
  }
};