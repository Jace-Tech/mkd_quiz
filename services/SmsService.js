/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * SMS Service
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const db = require('../models');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

module.exports = {
  from: phoneNumber,

  template: function (slug) {
    return new Promise(function (resolve, reject) {
      db.sms
        .findOne({ where: { slug } })
        .then((response) => {
          if (!response) {
            return reject(`TEMPLATE_NOT_FOUND`);
          } else resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  inject: function (template, payload) {
    let body = template.content;

    for (const key in payload) {
      const element = payload[key];
      body = body.replace(new RegExp('{{{' + key + '}}}', 'g'), element);
    }

    return body;
  },

  /**
   * Send SMS
   * @param {string} to
   * @param {string} body
   */
  send: function (to, body) {
    let self = this;
    return new Promise(function (resolve, reject) {
      client.messages
        .create({
          body,
          from: self.from,
          to,
        })
        .then((message) => resolve(message.sid))
        .catch((error) => reject(error));
    });
  },
};
