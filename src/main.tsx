import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { registerServiceWorker, showUpdateAvailableNotification } from './utils/serviceWorker';
import { performanceMonitor } from './utils/performanceMonitor';

// Register service worker for offline functionality
if (import.meta.env.PROD) {
  registerServiceWorker({
    onSuccess: () => {
      console.log('App is cached and ready for offline use');
    },
    onUpdate: () => {
      console.log('New content available, please refresh');
      showUpdateAvailableNotification();
    },
    onOfflineReady: () => {
      console.log('App is ready to work offline');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
