/**
 * Notification Scheduler for Ramadan Taqvim
 * 
 * Handles sending Firebase Cloud Messaging (FCM) notifications
 * to subscribed browsers at scheduled times.
 */

import { getMessaging } from '@/lib/firebaseAdmin.js';

/**
 * In-memory storage of subscriptions (shared with subscribe endpoint)
 * In production, this should be persisted to a database
 */
let subscriptions = [];

/**
 * Get all stored subscriptions
 * This is called by cronScheduler when sending notifications
 */
export function getSubscriptions() {
  return subscriptions;
}

/**
 * Add a new subscription
 * Called from /api/notifications/subscribe endpoint
 */
export function addSubscription(subscription) {
  const exists = subscriptions.some(
    (sub) => sub.endpoint === subscription.endpoint
  );

  if (!exists) {
    subscriptions.push(subscription);
    console.log('✅ Subscription stored:', subscription.endpoint);
    return true;
  }

  return false;
}

/**
 * Remove a subscription
 */
export function removeSubscription(endpoint) {
  const index = subscriptions.findIndex((sub) => sub.endpoint === endpoint);
  if (index !== -1) {
    subscriptions.splice(index, 1);
    console.log('Subscription removed:', endpoint);
    return true;
  }
  return false;
}

/**
 * Get subscription count
 */
export function getSubscriptionCount() {
  return subscriptions.length;
}

/**
 * Send FCM notification to all subscribed browsers via Web Push API
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} type - Notification type ('morning' or 'evening')
 */
export async function sendNotificationViaFCM(title, body, type = 'prayer') {
  const subscribedCount = subscriptions.length;

  if (subscribedCount === 0) {
    console.log('⚠️  No subscriptions found, skipping notification send');
    return {
      success: true,
      sent: 0,
      failed: 0,
      message: 'No active subscriptions',
    };
  }

  try {
    const messaging = getMessaging();
    const tokens = subscriptions.map((sub) => sub.endpoint);

    const payload = {
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          requireInteraction: true,
          tag: `ramadan-${type}`,
          actions: [
            {
              action: 'open',
              title: 'Open App',
            },
          ],
        },
        fcmOptions: {
          link: '/',
        },
      },
      data: {
        type,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📤 Sending FCM notification to ${subscribedCount} subscribers...`);
    console.log(`   Title: ${title}`);
    console.log(`   Body: ${body}`);
    console.log(`   Type: ${type}`);

    // Send to all tokens using multicast
    const response = await messaging.sendMulticast({
      tokens,
      ...payload,
    });

    const successCount = response.successCount;
    const failureCount = response.failureCount;

    if (failureCount > 0) {
      console.warn(`⚠️  ${failureCount} notification(s) failed to send:`);
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.warn(`   - ${tokens[index]}: ${resp.error.message}`);
          // Remove failed subscription
          removeSubscription(tokens[index]);
        }
      });
    }

    console.log(`✅ Notification sent successfully to ${successCount} subscriber(s)`);

    return {
      success: true,
      sent: successCount,
      failed: failureCount,
      message: `Sent to ${successCount} subscribers, ${failureCount} failed`,
    };
  } catch (error) {
    console.error('❌ Error sending FCM notification:', error);

    return {
      success: false,
      sent: 0,
      failed: subscriptions.length,
      error: error.message,
    };
  }
}

/**
 * Clear all subscriptions (useful for testing or cleanup)
 */
export function clearAllSubscriptions() {
  console.log(`Clearing ${subscriptions.length} subscriptions`);
  subscriptions = [];
}

export default {
  getSubscriptions,
  addSubscription,
  removeSubscription,
  getSubscriptionCount,
  sendNotificationViaFCM,
  clearAllSubscriptions,
};
