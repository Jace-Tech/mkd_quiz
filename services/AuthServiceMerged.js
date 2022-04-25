/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Auth Service
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const passwordService = require('./PasswordService');
const mailService = require('./MailService');
const generateCode = require('../utils/generateCode');
const db = require('../models');

const errors = {
  EMAIL_ADDRESS_NOT_FOUND: 'xyzEMAIL_ADDRESS_NOT_FOUND',
  EMAIL_ADDRESS_ALREADY_EXIST: 'xyzEMAIL_ADDRESS_ALREADY_EXIST',
  PASSWORD_NOT_MATCH: 'xyzPASSWORD_NOT_MATCH',
  INVALID_EMAIL_CONFIRMATION_CODE: 'xyzINVALID_EMAIL_CONFIRMATION_CODE',
  INVALID_EMAIL_OR_PASSWORD: 'xyzINVALID_EMAIL_OR_PASSWORD',
};

module.exports = {
  /**
   * Register new user with email and password
   * @name authService.register
   * @param {String} email user new email address
   * @param {String} password user new password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.register(req.body.email, req.body.password)
   */
  register: async function (email, password, role_id, user_details = {}) {
    try {
      const isEmailAddressExist = await db.user.getByFields({
        email,
      });

      if (isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_ALREADY_EXIST);

      const hashedPassword = await passwordService.hash(password);

      var user = await db.user.insert(
        {
          ...user_details,
          email: email,
          password: hashedPassword,
          role_id,
          type: 0,
          verify: 1,
          status: 1,
        },
        { returnAllFields: true },
      );

      return { user };
    } catch (error) {
      if (user) {
        await db.user.realDelete(user.id);
      }
      console.error(error);
      throw error;
    }
  },
  /**
   * Login user with email and password
   * @name authService.login
   * @param {String} email user email address
   * @param {String} password user password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.login(req.body.email, req.body.password)
   */
  login: async function (email, password, role_id) {
    try {
      const user = await db.user.getByFields({
        email,
        status: 1,
        role_id,
        type: 0,
      });

      if (!user) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { password: hashedPassword } = user;

      const isPasswordMatch = await passwordService.compareHash(password, hashedPassword);

      if (!isPasswordMatch) throw new Error(errors.INVALID_EMAIL_OR_PASSWORD);

      return { user: user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Send email and save to database
   * @name authService.forgotPassword
   * @param {String} email user email address
   * @return {Promise.<Void>}
   * @example
   * await authService.forgotPassword(req.body.email)
   */
  forgotPassword: async function (email) {
    try {
      const user = await db.user.getByFields({
        email: email,
      });

      if (!user) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const verificationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template('reset-password');

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${user.first_name} ${user.last_name}`,
          verification_code: verificationCode,
        },
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: verificationCode, user_id: user.id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Verify forgot password confirmation code
   * @name authService.verifyForgotPassword
   * @param {code} code confirmation code
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.verifyForgotPassword(req.body.code)
   */
  verifyForgotPassword: async function (code) {
    try {
      const Token = await db.token.findByFields({
        token: code,
      });
      const user = await db.user.getLast({ user_id: Token.user_id });
      return { user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Reset password
   * @name authService.resetPassword
   * @param {String} password user new password
   * @param {String} credential_id user credential id
   * @example
   * await authService.resetPassword(req.body.password, credential_id)
   */
  resetPassword: async function (password, userId) {
    try {
      const hashedPassword = await passwordService.hash(password);

      await db.user.edit(
        {
          password: hashedPassword,
        },
        userId,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Email confirmation
   * @name authService.emailConfirmation
   * @param {String} email user email address
   * @example
   * await authService.emailConfirmation(email)
   */
  emailConfirmation: async function (email) {
    try {
      const user = await db.user.getByFields({
        email: email,
      });

      if (!user) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const confirmationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template('email-confirmation');

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${user.first_name} ${user.last_name}`,
          confirmation_code: confirmationCode,
        },
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: confirmationCode, user_id: user.id, type: 6 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Verify Email address
   * @name authService.emailVerify
   * @param {String} token email confirmation code
   * @param {string} user_id user id
   * @example
   * await authService.emailVerify(email, user_id)
   */
  emailVerify: async function (token, user_id) {
    try {
      const isTokenExist = await db.token.getByFields({
        user_id,
        token,
        type: 6,
      });

      if (!isTokenExist) throw new Error(errors.INVALID_EMAIL_CONFIRMATION_CODE);

      await db.token.realDelete(isTokenExist.id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * check if user need to change password before logging in
   * @name authService.forcePasswordChange
   * @param {string} user_id user id
   */
  forcePasswordChange: async function (user_id) {
    try {
      const { profile_id } = await db.user.getByPk(user_id);
      const { force_password_change } = await db.profile.getByPk(profile_id);

      if (force_password_change) return true;
      else return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
