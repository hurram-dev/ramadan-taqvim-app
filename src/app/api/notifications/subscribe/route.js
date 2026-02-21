import { NextResponse } from 'next/server';
import { addSubscription, getSubscriptionCount } from '@/services/notificationScheduler.js';

export async function POST(request) {
  try {
    const { subscription } = await request.json();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription is required' },
        { status: 400 }
      );
    }

    if (!subscription.endpoint) {
      return NextResponse.json(
        { error: 'Subscription endpoint is required' },
        { status: 400 }
      );
    }

    // Add subscription using the notificationScheduler module
    addSubscription(subscription);

    return NextResponse.json({
      success: true,
      message: 'Subscribed to push notifications',
      endpoint: subscription.endpoint,
    });
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return NextResponse.json({
    subscriptions: getSubscriptionCount(),
  });
}
