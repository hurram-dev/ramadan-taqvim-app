import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment configuration
 * GET /api/admin/debug - Check all required environment variables
 */

export async function GET(request) {
  const envStatus = {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ? '✅ SET'
      : '❌ NOT SET',
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      ? '✅ SET'
      : '❌ NOT SET',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ? '✅ SET'
      : '❌ NOT SET',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
      ? '✅ SET'
      : '❌ NOT SET',
    FIREBASE_ADMIN_SDK_KEY: process.env.FIREBASE_ADMIN_SDK_KEY ? '✅ SET' : '❌ NOT SET',
  };

  const missingVars = Object.entries(envStatus)
    .filter(([_, status]) => status === '❌ NOT SET')
    .map(([key, _]) => key);

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    envStatus,
    issues: missingVars.length > 0 ? missingVars : 'None',
    message:
      missingVars.length > 0
        ? `Missing environment variables: ${missingVars.join(', ')}`
        : 'All required environment variables are set!',
  });
}
