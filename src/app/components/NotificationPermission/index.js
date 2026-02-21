'use client';

import { useEffect, useState } from 'react';

export default function NotificationPermission() {
  const [permission, setPermission] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const notificationPermission = Notification.permission;
      setPermission(notificationPermission);

      // Show prompt if permission hasn't been requested yet
      if (notificationPermission === 'default') {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
          console.log('✅ Notification permission granted');
          setShowPrompt(false);

          // Register for push notifications
          if ('serviceWorker' in navigator) {
            try {
              console.log('⏳ Waiting for service worker...');
              const registration = await navigator.serviceWorker.ready;
              console.log('✅ Service worker is ready:', registration);

              if (!registration.pushManager) {
                throw new Error('Push Manager not available in this browser');
              }

              const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
              if (!vapidKey) {
                throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY not set in environment');
              }

              console.log('🔑 VAPID Key is set (length:', vapidKey.length, ')');

              // Subscribe to push notifications
              console.log('📝 Subscribing to push manager...');
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey,
              });
              console.log('✅ Push subscription obtained:', subscription.endpoint);

              // Send subscription to backend
              console.log('📤 Sending subscription to backend...');
              const subscribeResponse = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  subscription: subscription.toJSON(),
                }),
              });

              if (!subscribeResponse.ok) {
                throw new Error(`Subscribe API returned ${subscribeResponse.status}`);
              }

              const subscribeData = await subscribeResponse.json();
              console.log('✅ Subscribed to push notifications:', subscribeData);

              // Initialize cron jobs after successful subscription
              console.log('🚀 Initializing cron jobs...');
              const initResponse = await fetch('/api/admin/init', {
                method: 'POST',
              });

              if (initResponse.ok) {
                const initData = await initResponse.json();
                console.log(
                  '✅ Cron jobs initialized:',
                  initData.message,
                  `(${initData.jobsCount} jobs)`
                );
              } else {
                console.warn('⚠️ Failed to initialize cron jobs - status:', initResponse.status);
              }
            } catch (swError) {
              console.error('❌ Service worker error:', swError.message);
              console.error('Stack:', swError.stack);
            }
          } else {
            console.warn('⚠️ Service Worker not supported in this browser');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error.message);
      console.error('Stack:', error.stack);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || permission === 'granted') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg z-40 animate-slide-down">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.25l-.5 1H2a1 1 0 00-1 1v2a1 1 0 001 1h16a1 1 0 001-1v-2a1 1 0 00-1-1h-1.5l-.5-1V8a6 6 0 00-6-6zM7 16a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm md:text-base">
              Bildirishnomalarni Yoqing
            </p>
            <p className="text-purple-50 text-xs md:text-sm">
              Saharlik va iftorlik vaqti yaqinlashganda xabardor bo'ling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRequestPermission}
            className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors text-sm"
          >
            Yoqish
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-white hover:bg-purple-600 rounded-lg transition-colors"
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
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
        }
      `}</style>
    </div>
  );
}
