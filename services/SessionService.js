/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Session Service
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

module.exports = {
  verifySessionMiddleware: function (role, roleName = "") {
    return function (req, res, next) {
      const two_factor_authentication = req.session.two_factor_authentication;

      const currentRole = req.session.role ? req.session.role : 0;
      if (currentRole === 0 || currentRole != role) {
        return res.redirect(`${roleName ? "/" + roleName : ""}/login?redirect_to=${req.originalUrl}`);
      } else if (two_factor_authentication) {
        return res.redirect(`/${roleName}/verify-account`);
      } else {
        next();
      }
    };
  },

  preventAuthRoutes: function (role, roleName) {
    return (req, res, next) => {
      const sessionRole = req.session.role;

      if (sessionRole === role) {
        return res.redirect("/" + roleName + "/dashboard");
      } else {
        next();
      }
    };
  },

  prevent2FA: function (role, roleName) {
    return (req, res, next) => {
      const currentRole = req.session.role;
      const twoFA = req.session.two_factor_authentication;

      if (currentRole !== role || !twoFA) {
        return res.redirect("/" + roleName + "/login");
      } else {
        next();
      }
    };
  },

  randomString: function (len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+{}|":?><,./;[]';
    let randomString = "";
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  },
};
