// Cherry Bloom — Web & PWA Runtime Utilities
// Safe no-ops on native iOS/Android and Expo Snack; active on Web/Vercel.

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

let globalDeferredPrompt = null;
const promptSubscribers = new Set();

function notifySubscribers() {
  for (const fn of promptSubscribers) {
    fn(globalDeferredPrompt);
  }
}

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    globalDeferredPrompt = event;
    notifySubscribers();
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    notifySubscribers();
  });
}

/**
 * Registers the PWA Service Worker on Web when running over HTTPS or localhost.
 */
export function registerWebPwa() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }
  if (!('serviceWorker' in navigator)) {
    return;
  }
  const host = window.location?.hostname || '';
  if (host.includes('snack-runtime') || host.includes('expo.dev')) {
    return;
  }
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

/**
 * React hook that exposes PWA install prompt capability on Web/Desktop/Android Chrome,
 * plus iOS "Add to Home Screen" detection.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIosSafariPrompt, setIsIosSafariPrompt] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const standalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true;

    setIsInstalled(Boolean(standalone));

    const ua = window.navigator?.userAgent || '';
    const isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (isIos && !standalone) {
      setIsIosSafariPrompt(true);
    }

    const listener = (promptEvent) => {
      setDeferredPrompt(promptEvent);
      if (!promptEvent) {
        setIsInstalled(
          Boolean(
            window.matchMedia?.('(display-mode: standalone)')?.matches ||
              window.navigator?.standalone === true
          )
        );
      }
    };

    promptSubscribers.add(listener);
    return () => {
      promptSubscribers.delete(listener);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!globalDeferredPrompt) {
      return false;
    }
    try {
      globalDeferredPrompt.prompt();
      const choice = await globalDeferredPrompt.userChoice;
      globalDeferredPrompt = null;
      notifySubscribers();
      return choice?.outcome === 'accepted';
    } catch {
      return false;
    }
  }, []);

  return {
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isIosSafariPrompt: isIosSafariPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  };
}
