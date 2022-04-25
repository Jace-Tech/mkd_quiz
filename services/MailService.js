const nodemailer = require('nodemailer');

const db = require('../models');

module.exports = {
  /** @private */
  transport: null,
  /** @private */
  from: null,
  /** @private */
  to: null,
  /**
   * Nodemailer initializer
   * @name mailService.initialize
   * @param {{hostname: String, port: Number, username: String, password: String, from: String, to: String}} config Nodemailer configuration
   * @returns {Void}
   */
  initialize: function (config) {
    this.transport = nodemailer.createTransport({
      host: config.hostname,
      port: config.port,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });

    this.from = config.from;
    this.to = config.to;
  },
  /**
   * Get email template from database
   * @name mailService.template
   * @param {String} slug email template slug
   * @reject {Error}
   * @returns {Promise.<{body: String, subject: String}>} email template
   */
  template: function (slug) {
    return new Promise(function (resolve, reject) {
      db.email
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
  /**
   * Inject values into email template
   * @name mailService.inject
   * @param {{body: String, subject: String}} template email template
   * @param {Object.<string, string>} payload template values
   * @returns {{from: String, to: String, subject: String, text: String}}  Value injected email template
   */
  inject: function (template, payload) {
    let mailBody = template.body;
    let mailSubject = template.subject;

    for (const key in payload) {
      const value = payload[key];
      mailBody = mailBody.replace(new RegExp('{{{' + key + '}}}', 'g'), value);
    }

    for (const key in payload) {
      const value = payload[key];
      mailSubject = mailSubject.replace(
        new RegExp('{{{' + key + '}}}', 'g'),
        value,
      );
    }

    return {
      from: this.from,
      to: this.to,
      subject: mailSubject,
      html: mailBody,
    };
  },
  /**
   * Send email
   * @name mailService.send
   * @param {nodemailer.SendMailOptions} template email template
   * @reject {Error} send mail error
   * @returns {Promise.<nodemailer.SentMessageInfo>} send mail info
   */
  send: function (template) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.transport
        .sendMail(template)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
};
