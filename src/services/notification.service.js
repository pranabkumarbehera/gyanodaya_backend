const { getFirebaseApp, admin } = require("../config/firebase");

class NotificationService {
  async sendPushNotification({ token, title, body, data = {} }) {
    const app = getFirebaseApp();
    if (!app) {
      return { skipped: true, message: "Firebase is not configured" };
    }

    await admin.messaging().send({
      token,
      notification: { title, body },
      data
    });

    return { sent: true };
  }
}

module.exports = new NotificationService();
