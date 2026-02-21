/**
 * Next.js Middleware for server-side initialization
 * This initializes cron jobs when the server starts
 * 
 * In development: Initialize on first request
 * In production: Initialize when the server starts
 */

import { NextResponse } from 'next/server';

// Track if initialization has been attempted
let initializationAttempted = false;

export async function middleware(request) {
  // Only try to initialize once per server instance
  if (!initializationAttempted && typeof window === 'undefined') {
    initializationAttempted = true;

    try {
      // Dynamically import here to avoid circular dependencies
      const { initCronJobs, isCronJobsInitialized } = await import('./src/services/cronScheduler.js');

      if (!isCronJobsInitialized()) {
        console.log('🚀 Initializing cron jobs on server startup...');
        await initCronJobs();
      }
    } catch (error) {
      console.error('❌ Error initializing cron jobs:', error);
      // Don't fail the request, just log the error
    }
  }

  return NextResponse.next();
}

// Run for API initialization route first to ensure cron jobs are ready
export const config = {
  matcher: [
    // Run on all requests to ensure init happens early
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};

