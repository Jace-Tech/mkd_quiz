/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Auth Service
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const passwordService = require("./PasswordService");
const mailService = require("./MailService");
const generateCode = require("../utils/generateCode");
const db = require("../models");
const errors = require("../core/errors");

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
  register: async function (email, password, roleId, userDetails = {}) {
    try {
      const isEmailAddressExist = await db.credential.getByFields({
        email,
      });

      if (isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_ALREADY_EXIST);

      const hashedPassword = await passwordService.hash(password);

      var user = await db.user.insert({ ...userDetails, role_id: roleId }, { returnAllFields: true });
      var credential = await db.credential.insert(
        {
          email: email,
          password: hashedPassword,
          user_id: user.id,
          type: 0,
          verify: 0,
          status: 1,
        },
        { returnAllFields: true }
      );

      return { credential: credential.id, user: user.id };
    } catch (error) {
      if (credential) {
        await db.credential.realDelete(credential.id);
      }
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
  login: async function (email, password, roldId) {
    try {
      const isEmailAddressExist = await db.credential.findOne({
        where: { email, status: 1, type: 0 },
        include: [{ model: db.user, required: true, as: "user", where: { role_id: roldId } }],
      });

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { password: hashedPassword, id, user_id } = isEmailAddressExist;

      const user = await db.user.getByPK(user_id);

      if (!user) {
        throw new Error(errors.USER_NOT_FOUND);
      }

      const isPasswordMatch = await passwordService.compareHash(password, hashedPassword);

      if (!isPasswordMatch) throw new Error(errors.INVALID_EMAIL_OR_PASSWORD);

      return { credential: id, user: user.id };
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
      const isEmailAddressExist = await db.credential.getByFields({
        email: email,
      });

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { user_id } = isEmailAddressExist;

      const getUser = await db.user.getByPK(user_id);

      const verificationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template("reset-password");

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${getUser.first_name} ${getUser.last_name}`,
          verification_code: verificationCode,
        }
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: verificationCode, user_id });
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
      const Token = await db.token.getByFields({
        token: code,
      });

      const Credential = await db.credential.getByFields({
        user_id: Token.user_id,
      });

      return { credential: Credential.id, user: Credential.user_id };
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
  resetPassword: async function (password, credential_id) {
    try {
      const hashedPassword = await passwordService.hash(password);

      await db.credential.edit(
        {
          password: hashedPassword,
        },
        credential_id
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
      const isEmailAddressExist = await db.credential.getByFields({
        email: email,
      });

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { user_id } = isEmailAddressExist;

      const user = await db.user.getByPK(user_id);

      const confirmationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template("email-confirmation");

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${user.first_name} ${user.last_name}`,
          confirmation_code: confirmationCode,
        }
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: confirmationCode, user_id, type: 6 });
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
      const { profile_id } = await db.user.getByPK(user_id);
      const { force_password_change } = await db.profile.getByPK(profile_id);

      if (force_password_change) return true;
      else return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
