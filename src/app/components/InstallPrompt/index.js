'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event for later use
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Handle app successfully installed
    window.addEventListener('appinstalled', () => {
      console.log('App was installed successfully');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-400 to-green-500 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm md:text-base">
                Ramazon Taqvimi O'rnatish
            </p>
            <p className="text-green-50 text-xs md:text-sm">
              Taqvimga oson kirish uchun uni qurilmangizga o'rnating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors text-sm"
          >
            O'rnatish
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-white hover:bg-green-600 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        }
      `}</style>
    </div>
  );
}
