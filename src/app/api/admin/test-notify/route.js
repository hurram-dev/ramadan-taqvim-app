import { sendNotificationViaFCM } from '@/services/notificationScheduler.js';

export async function POST(request) {
  try {
    const { title, body, type } = await request.json();

    await sendNotificationViaFCM(
      title || 'Test Notification',
      body || 'This is a test notification',
      type || 'test'
    );

    return Response.json({
      success: true,
      message: 'Test notification sent',
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}