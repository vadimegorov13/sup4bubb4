import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * Initialize firebase-admin
 *
 * To configure functions.config() follow the documentation:
 * https://firebase.google.com/docs/functions/config-env
 */
admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  databaseURL: 'https://sup4bubb4.firebaseio.com',
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

export { admin, db, FieldValue };
