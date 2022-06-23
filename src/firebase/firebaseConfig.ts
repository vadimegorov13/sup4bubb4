/**
 * Firebase configuration
 */
export const firebaseConfig = {
  apiKey: process.env.SAPPER_APP_API_KEY,
  authDomain: process.env.SAPPER_APP_AUTH_DOMAIN,
  projectId: process.env.SAPPER_APP_PROJECT_ID,
  storageBucket: process.env.SAPPER_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.SAPPER_APP_MESSAGING_SENDER_ID,
  appId: process.env.SAPPER_APP_APP_ID,
};
