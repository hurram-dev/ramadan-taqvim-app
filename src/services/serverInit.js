/**
 * Server initialization module
 * This module should be imported in layout.js to initialize cron jobs on server start
 * 
 * Safe to use in Next.js since it checks for server environment and has initialization guards
 */

import { initCronJobs, isCronJobsInitialized } from './cronScheduler.js';

let initialized = false;

/**
 * Initialize cron jobs on server startup
 * This function is safe to call multiple times - it will only execute initialization once
 */
export async function init() {
  // Check if running on server side
  if (typeof window !== 'undefined') {
    return;
  }

  // Check if already initialized in this process
  if (initialized || isCronJobsInitialized()) {
    return;
  }

  try {
    initialized = true;
    await initCronJobs();
    console.log('✅ Cron jobs initialization completed');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    initialized = false;
  }
}

export default { init };
