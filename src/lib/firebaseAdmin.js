import admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK
 * This should only run on the server side (Node.js environment)
 */
let adminInstance = null;

export function getAdminInstance() {
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK should only be used on the server side');
  }

  if (adminInstance) {
    return adminInstance;
  }

  try {
    // Check if Firebase Admin is already initialized
    if (!admin.apps.length) {
      const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_KEY;

      if (!serviceAccountKey) {
        throw new Error(
          'FIREBASE_ADMIN_SDK_KEY environment variable is not set. ' +
          'Please add your Firebase service account key to your .env.local file.'
        );
      }

      // Parse the service account key from JSON string
      const serviceAccount = JSON.parse(serviceAccountKey);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    }

    adminInstance = admin;
    return adminInstance;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    throw error;
  }
}

export function getMessaging() {
  const admin = getAdminInstance();
  return admin.messaging();
}

export default getAdminInstance;
