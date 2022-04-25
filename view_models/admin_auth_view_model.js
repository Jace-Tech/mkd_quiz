'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Admin Authentication View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

const { nanoid, customAlphabet } = require('nanoid');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const db = require('../models');
const MailService = require('../services/MailService');
// const SmsService = require('../services/SmsService');

module.exports = function (entity, pageName = '', success, error) {
  this.entity = entity;

  this.success = success || null;
  this.error = error || null;

  this.email = '';
  this.resetToken = '';

  this.get_page_name = () => pageName;

  this.login_fields = { email: '', password: '' };
  this.register_fields = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  };
  this.forgot_fields = { email: '' };
  this.reset_fields = { password: '', confirm_password: '' };
  this.account_verification_fields = { verificationCode: '' };
  this.form_fields =  { 'first_name': '','last_name': '','credential.email': '','credential.password': '','status': '' }

  this.google_auth_url = '/admin/google/initialize';
  this.facebook_auth_url = '/admin/facebook/initialize';


  this.account_exists = function (email, otherFields={}) {
    return db.credential.getByFields({ email, status: 1, ...otherFields });
  };

  this.get_associated_user = function (id) {
    return this.entity.getByPK(id);
  };

  this.compare_password = function (password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  };

  this.generate_hash = function (password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
  };

  this.create_credential = function ({ ...args }) {
    return db.credential.insert({
      ...args,
    });
  };
  this.create_user = function ({ ...args }) {
    return this.entity.insert({
      ...args,
    });
  };

  this.destroy_credential = function (id) {
    return db.credential.realDelete(id);
  };
  this.destroy_user = function (id) {
    return db.user.realDelete(id);
  };

  this.createResetPasswordEmailTemplateForViews = function (slug) {
    return db.email.insert({
      slug: slug,
      subject: 'Forgot Password',
      "tag": "email,reset_token,link",
      html: `Hi {{{email}}},<br/>You have requested to reset your password. Please click the link below to reset it.<br/><a href=\"{{{link}}}/{{{reset_token}}}\">Link</a>. <br/>Thanks,<br/> Admin`,
    }, {
      returnAllFields:true
    });
  };

  this.initializeMailService = function (email) {
    MailService.initialize({
      hostname: process.env.EMAIL_SMTP_SMTP_HOST,
      port: process.env.EMAIL_SMTP_SMTP_PORT,
      username: process.env.EMAIL_SMTP_SMTP_USER,
      password: process.env.EMAIL_SMTP_SMTP_PASS,
      from: process.env.MAIL_FROM,
      to: email,
    });
  };

  this.getForgotPasswordMailTemplate = async function (slug) {
    try {
      const template = await MailService.template(slug);
      return template;
    } catch (error) {
      if (error === 'TEMPLATE_NOT_FOUND') {
        const template = await this.createResetPasswordEmailTemplateForViews(
          slug,
        );
        if (template) {
          return template;
        }
      }
      return null;
    }
  };

  this.injectMailTemplate = function (template, payload) {
    return MailService.inject(template, payload);
  };

  this.sendMail = function (template) {
    return MailService.send(template);
  };

  this.generateRandomToken = function (size = 32) {
    return nanoid(size);
  };

  this.saveTokenToDB = function (
    token,
    user_id,
    issue_at = new Date(),
    expire_at = Date.now() + 36000000,
  ) {
    return db.token.insert({ token, user_id, issue_at, expire_at });
  };

  this.validateToken = async function (token) {
    try {
      const isValid = await db.token.findOne({
        where: {
          token,
          expire_at: { [Op.gt]: new Date() },
        },
      });
      return isValid;
    } catch (error) {
      return false;
    }
  };

  this.getUserCredential = function (user_id) {
    return db.credential.findOne({ where: { user_id } });
  };

  this.updatePassword = function (hashedPassword, credential_id) {
    return db.credential.edit(
      {
        password: hashedPassword,
      },
      credential_id,
    );
  };

  this.create2FATemplate = function () {
    return db.sms.insert({
      slug: 'verify',
      tag: 'code',
      content: 'Your verification code is {{{code}}}',
    });
  };

  this.sendSMS = async function (to, userID, slug = 'verify') {
    const code = customAlphabet('0123456789', 8)();

    try {
      const template = await SmsService.template(slug);
      const finalTemplate = SmsService.inject(template, { code });
      await this.saveTokenToDB(code, userID);
      return SmsService.send(to, finalTemplate);
    } catch (error) {
      if (error === 'TEMPLATE_NOT_FOUND') {
        const template = await this.create2FATemplate();
        if (template) {
          const finalTemplate = SmsService.inject(template, { code });
          await this.saveTokenToDB(code, userID);
          return SmsService.send(to, finalTemplate);
        }
        throw new Error(error);
      }
      throw new Error(error);
    }
  };

  this.status_mapping = function () {
    return db.user.status_mapping();
  };
  this.role_id_mapping = function () {
    return db.user.role_id_mapping();
  };

  this.type_mapping = function () {
    return db.user.type_mapping();
  };

  this.verify_mapping = function () {
    return db.user.verify_mapping();
  };

  this.two_factor_authentication_mapping = function () {
    return db.user.two_factor_authentication_mapping();
  };

  this.force_password_change_mapping = function () {
    return db.user.force_password_change_mapping();
  };


  return this;
};
