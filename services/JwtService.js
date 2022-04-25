/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * JWT Service
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: './src/.env' });

module.exports = {
  createAccessToken: function (
    payload,
    expireIn = process.env.DYNAMIC_CONFIG_JWT_EXPIRE_AT,
  ) {
    const secret = process.env.DYNAMIC_CONFIG_JWT_KEY;

    return jwt.sign(payload, secret, {
      expiresIn: Number(expireIn),
      algorithm: 'HS256',
    });
  },
  createRefreshToken: function (payload) {
    return jwt.sign(payload, process.env.DYNAMIC_CONFIG_JWT_KEY, {
      expiresIn: Number(process.env.DYNAMIC_CONFIG_JWT_REFRESH_EXPIRE_AT),
      algorithm: 'HS256',
    });
  },

  verifyAccessToken: function (token) {
    try {
      return jwt.verify(token, process.env.DYNAMIC_CONFIG_JWT_KEY);
    } catch (err) {
      return false;
    }
  },
  verifyRefreshToken: function (token) {
    try {
      return jwt.verify(token, process.env.DYNAMIC_CONFIG_JWT_KEY);
    } catch (err) {
      return false;
    }
  },
  generateString: function (length) {
    let d = new Date().getTime();
    const time = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
      },
    );

    return (uuid.toUpperCase() + '-' + time.toString()).substring(0, length);
  },
  generateUUID: function () {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
      },
    );
    return uuid.toUpperCase();
  },
  getToken: function (req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  },
  verifyTokenMiddleware: function (role) {
    const self = this;
    return function (req, res, next) {
      const token = self.getToken(req);
      if (!token) {
        return res.status(401).json({
          success: false,
          code: 'UNAUTHORIZED',
        });
      } else {
        const result = self.verifyAccessToken(token);
        if (!result) {
          return res.status(401).json({
            success: false,
            code: 'TOKEN_EXPIRED',
          });
        }
        req.user_id = result;
        next();
      }
    };
  },
};
