import { NextResponse } from 'next/server';
import { initCronJobs, isCronJobsInitialized, getScheduledJobsCount } from '@/services/cronScheduler.js';

/**
 * Admin initialization endpoint
 * POST /api/admin/init - Initialize cron jobs (idempotent)
 * GET /api/admin/init - Check initialization status
 */

export async function POST(request) {
  try {
    // Check if already initialized
    if (isCronJobsInitialized()) {
      return NextResponse.json(
        {
          success: true,
          message: 'Cron jobs already initialized',
          jobsCount: getScheduledJobsCount(),
        },
        { status: 200 }
      );
    }

    // Initialize cron jobs
    await initCronJobs();

    return NextResponse.json(
      {
        success: true,
        message: 'Cron jobs initialized successfully',
        jobsCount: getScheduledJobsCount(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in initialization:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const isInitialized = isCronJobsInitialized();
    const jobsCount = getScheduledJobsCount();

    return NextResponse.json(
      {
        initialized: isInitialized,
        jobsCount,
        message: isInitialized
          ? `${jobsCount} cron jobs are scheduled`
          : 'Cron jobs not yet initialized',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error checking initialization status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
