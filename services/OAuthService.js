const querystring = require('querystring');
const axios = require('axios').default;

const db = require('../models');

module.exports = {
  google: {
    /**
     * Generates authentication URL
     * @name oAuth.google.generateAuthURL
     * @param {{redirect_uri: String, client_id: String}} config
     * @returns {String} authentication URL
     */
    generateAuthURL(config) {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

      const options = {
        redirect_uri: config.redirect_uri,
        client_id: config.client_id,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
      };

      return `${rootUrl}?${querystring.stringify(options)}`;
    },
    /**
     * Generates authentication Token
     * @name oAuth.google.generateAuthToken
     * @param {{auth_code: String, client_id: String, client_secret: String, redirect_uri: String}} config
     * @returns {Promise.<{{access_token: String, expires_in: String, refresh_token: String, scope: String, token_type: String id_token: String}}>} authentication token
     */
    generateAuthToken(config) {
      return new Promise(function (resolve, reject) {
        const url = 'https://oauth2.googleapis.com/token';

        const buildQuerystring = querystring.stringify({
          code: config.auth_code,
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: config.redirect_uri,
          grant_type: 'authorization_code',
        });

        axios.default
          .post(url, buildQuerystring, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      });
    },
    /**
     * Retrieve user information
     * @name oAuth.google.getUserInfo
     * @param {{access_token: String, expires_in: String, refresh_token: String, scope: String, id_token: String}} config
     * @returns {Promise.<{id: string, email: string, verified_email: true, name: string, given_name: string, family_name: string, picture: string, locale: string}>} user information
     */
    getUserInfo(config, isAPI = false) {
      return new Promise(function (resolve, reject) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${config.access_token}`,
            isAPI
              ? {}
              : {
                  headers: {
                    Authorization: `Bearer ${config.id_token}`,
                  },
                },
          )
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      });
    },
  },
  facebook: {
    /**
     * Generates authentication URL
     * @name oAuth.facebook.generateAuthURL
     * @param {{redirect_uri: String, client_id: String}} config
     * @returns {String} authentication URL
     */
    generateAuthURL(config) {
      const stringifiedParams = querystring.stringify({
        client_id: config.client_id,
        redirect_uri: process.env.DYNAMIC_CONFIG_FACEBOOK_REDIRECT_URI,
        scope: ['email', 'user_friends'].join(','),
        response_type: 'code',
        auth_type: 'rerequest',
        display: 'popup',
      });

      return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
    },
    /**
     * Generates authentication Token
     * @name oAuth.facebook.generateAuthToken
     * @param {{auth_code: String, client_id: String, client_secret: String, redirect_uri: String}} config
     * @returns {Promise.<{access_token: String, token_type: String, expires_in: String}>} authentication token
     */
    async generateAuthToken(config) {
      const url = 'https://graph.facebook.com/v4.0/oauth/access_token';

      const { data } = await axios({
        url,
        method: 'GET',
        params: {
          code: config.auth_code,
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: config.redirect_uri,
        },
      });

      return data;
    },
    /**
     * Retrieve user information
     * @name oAuth.facebook.getUserInfo
     * @param {{access_token: String, token_type: String, expires_in: String}} config
     * @returns {Promise.<{id: string, email: string, first_name: string, last_name: string, image: string}>} user information
     */
    async getUserInfo(config) {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'GET',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token: config.access_token,
        },
      });

      return data;
    },
  },
  async authenticate(user) {
    let User;
    let Credential;
    try {
      const isEmailExist = await db.credential.getByField('email', user.email);
      if (isEmailExist) {
        // Check status and role
        if (+isEmailExist.status === 0 || +user.role === +isEmailExist.role) {
          throw new Error('EMAIL_ADDRESS_NOT_FOUND');
        }
        // Check provider type type
        const type = isEmailExist.type === user.provider;
        if (!type) {
          throw new Error('ACCOUNT_IS_REGISTERED_WITH_' + (user.provider === 'n' ? 'EMAIL_AND_PASSWORD' : user.provider === 'g' ? 'GOOGLE' : 'FACEBOOK'));
        }
        const userExists = await db.user.getByPK(isEmailExist.user_id);

        if (!userExists) {
          throw new Error('EMAIL_ADDRESS_NOT_FOUND');
        }

        return {
          credential: isEmailExist.id,
          user: userExists,
        };
      }

      User = await db.user.insert(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          image: user.image,
        },
        { returnAllFields: true },
      );

      Credential = await db.credential.insert(
        {
          user_id: User.id,
          email: user.email,
          type: user.provider,
          role_id: user.role_id,
          status: 1,
        },
        { returnAllFields: true },
      );

      return { credential: Credential.id, user: User };
    } catch (error) {
      if (User) {
        User.destroy();
      }

      if (Credential) {
        Credential.destroy();
      }

      throw new Error(error.message);
    }
  },
};
