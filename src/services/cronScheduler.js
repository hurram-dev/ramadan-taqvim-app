import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import path from 'path';
import { promises as fs } from 'fs';
import { sendNotificationViaFCM } from './notificationScheduler.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// Configuration
const CONFIG = {
  timezone: 'Asia/Tashkent',
  country: 'uz',
  notifyBefore: 15, // minutes before prayer time
};

// Store scheduled cron jobs for cleanup
let scheduledJobs = [];
let isInitialized = false;

/**
 * Get current time in Uzbekistan timezone
 */
const getUzbekTime = () => dayjs().tz(CONFIG.timezone);

/**
 * Calculate notification time (minutes before prayer time)
 * @param {number} hour - Prayer hour
 * @param {number} minute - Prayer minute
 * @returns {Object} - { notifyHour, notifyMinute, cronExpression }
 */
function calculateNotificationTime(hour, minute) {
  const prayerTime = dayjs()
    .tz(CONFIG.timezone)
    .set('hour', hour)
    .set('minute', minute);

  const notificationTime = prayerTime.subtract(CONFIG.notifyBefore, 'minute');

  const cronExpression = `${notificationTime.minute()} ${notificationTime.hour()} * * *`;

  return {
    notifyHour: notificationTime.hour(),
    notifyMinute: notificationTime.minute(),
    cronExpression,
    prayerTime,
  };
}

/**
 * Schedule notifications for a single day
 * @param {Object} taqvimDay - Taqvim entry for a single day
 */
function scheduleDayNotifications(taqvimDay) {
  const { date, time } = taqvimDay;
  const dayDate = dayjs(date).tz(CONFIG.timezone);

  // Schedule morning notification (15 mins before Suhoor ends)
  const morningCalc = calculateNotificationTime(time.morning.hour, time.morning.minute);
  const morningJob = cron.schedule(morningCalc.cronExpression, async () => {
    await sendNotificationViaFCM(
      'Saharlik Vaqti Tugaydi',
      `Saharlik vaqti ${time.morning.hour.toString().padStart(2, '0')}:${time.morning.minute.toString().padStart(2, '0')} da tugaydi`,
      'morning'
    );
  });

  // Schedule evening notification (15 mins before Iftar begins)
  const eveningCalc = calculateNotificationTime(time.evening.hour, time.evening.minute);
  const eveningJob = cron.schedule(eveningCalc.cronExpression, async () => {
    await sendNotificationViaFCM(
      'Iftorlik Vaqti Keladi',
      `Iftorlik vaqti ${time.evening.hour.toString().padStart(2, '0')}:${time.evening.minute.toString().padStart(2, '0')} da keladi`,
      'evening'
    );
  });

  scheduledJobs.push(morningJob, eveningJob);

  console.log(
    `⏰ [${dayDate.format('YYYY-MM-DD')}] Scheduled notifications: ` +
    `Morning at ${morningCalc.notifyHour.toString().padStart(2, '0')}:${morningCalc.notifyMinute.toString().padStart(2, '0')}, ` +
    `Evening at ${eveningCalc.notifyHour.toString().padStart(2, '0')}:${eveningCalc.notifyMinute.toString().padStart(2, '0')}`
  );
}

/**
 * Load taqvim data from JSON file
 * @returns {Promise<Array>} - Array of taqvim entries
 */
async function loadTaqvimData() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'public');
    const filePath = path.join(jsonDirectory, `data/${CONFIG.country}/taqvim.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const taqvimData = JSON.parse(fileContents);

    if (!Array.isArray(taqvimData)) {
      throw new Error('Taqvim data is not an array');
    }

    console.log(`📚 Loaded ${taqvimData.length} Ramadan days from taqvim.json`);
    return taqvimData;
  } catch (error) {
    console.error('❌ Error loading taqvim data:', error.message);
    throw error;
  }
}

/**
 * Initialize all cron jobs for the entire Ramadan season
 */
export async function initCronJobs() {
  if (isInitialized) {
    console.log('⚠️  Cron jobs already initialized, skipping...');
    return;
  }

  if (typeof window !== 'undefined') {
    console.log('⚠️  Cron jobs cannot be initialized on client side');
    return;
  }

  try {
    console.log('🚀 Initializing Ramadan notification cron jobs...');
    console.log(`⏰ Timezone: ${CONFIG.timezone} (GMT+5)`);
    console.log(`🌍 Country: ${CONFIG.country}`);
    console.log(`⏱️  Notify before prayer: ${CONFIG.notifyBefore} minutes`);

    const taqvimData = await loadTaqvimData();

    // Schedule notifications for all days
    taqvimData.forEach((day) => {
      scheduleDayNotifications(day);
    });

    isInitialized = true;
    console.log(`✅ Successfully initialized ${scheduledJobs.length} cron jobs for ${taqvimData.length} Ramadan days`);
  } catch (error) {
    console.error('❌ Error initializing cron jobs:', error);
    throw error;
  }
}

/**
 * Stop all scheduled cron jobs
 */
export function stopCronJobs() {
  try {
    scheduledJobs.forEach((job) => {
      job.stop();
      job.destroy();
    });
    scheduledJobs = [];
    isInitialized = false;
    console.log('✅ All cron jobs stopped');
  } catch (error) {
    console.error('❌ Error stopping cron jobs:', error);
  }
}

/**
 * Get current initialization status
 */
export function isCronJobsInitialized() {
  return isInitialized;
}

/**
 * Get count of scheduled cron jobs
 */
export function getScheduledJobsCount() {
  return scheduledJobs.length;
}

export default { initCronJobs, stopCronJobs, isCronJobsInitialized, getScheduledJobsCount };
