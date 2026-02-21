import { isCronJobsInitialized, getScheduledJobsCount } from '@/services/cronScheduler.js';

/**
 * Status endpoint to check cron job initialization
 * GET /api/admin/status - Check if cron jobs are initialized
 */

export async function GET(request) {
  return Response.json({
    initialized: isCronJobsInitialized(),
    scheduledJobs: getScheduledJobsCount(),
    timestamp: new Date().toISOString(),
    timezone: 'Asia/Tashkent (GMT+5)',
  });
}
