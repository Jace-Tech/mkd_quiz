const admin = require('firebase-admin');

class PushNotification {
  /**
   * Initialize firebase admin
   * {@link https://firebase.google.com/docs/admin/setup#initialize-sdk Initialize the SDK}.
   */
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });

    this.messaging = this.admin.messaging();
  }

  /**
   * Generate payload
   * @param {{body: string, title: string, image_url: string}} payload
   * @param {admin.messaging.MessagingPayload} override override default payload
   */
  generatePayload(payload, override) {
    return {
      notification: {
        body: payload.body,
        title: payload.title,
      },
      data: payload,
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcm_options: {
          image: payload.image_url,
        },
      },
      android: {
        notification: {
          image: payload.image_url,
        },
      },
      ...override,
    };
  }

  /**
   * Generate options
   * @param {admin.messaging.MessagingOptions} override override default options
   */
  generateOptions(override) {
    return {
      contentAvailable: true,
      priority: 'high',
      timeToLive: 60 * 60 * 24,
      ...override,
    };
  }

  /**
   * Send push notification
   * @param {string|string[]} deviceToken
   * @param {admin.messaging.MessagingPayload} payload
   * @param {admin.messaging.MessagingOptions} options
   * @returns {Promise.<admin.messaging.MessagingDevicesResponse>}
   * @example
   * const pushNotification = new PushNotification();
   * const payload = pushNotification.generatePayload({}) // {} = custom configuration
   * const options = pushNotification.generateOptions({}); // {} = custom configuration
   *
   * pushNotification
   *  .sendPushNotification('device_token', payload, options)
   *  .then((response) => {
   *    console.log('message send successfully');
   *  })
   *  .catch((error) => {
   *    console.log('error occurred');
   *  });
   */
  sendPushNotification(deviceToken, payload, options) {
    return new Promise((resolve, reject) => {
      this.messaging
        .sendToDevice(deviceToken, payload, options)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
}

module.exports = PushNotification;
