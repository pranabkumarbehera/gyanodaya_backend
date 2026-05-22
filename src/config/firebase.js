const admin = require("firebase-admin");
const env = require("./env");

let firebaseApp = null;

const getFirebaseApp = () => {
  if (firebaseApp || !env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey
    })
  });

  return firebaseApp;
};

module.exports = { getFirebaseApp, admin };
