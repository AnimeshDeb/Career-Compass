const admin = require('firebase-admin');
const serviceAccount = require('./career-compassDB.json');

let app;

try {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

const db = admin.firestore();

module.exports = { admin, db, app };