module.exports = {
  verifyPermission: function (role, roleName) {
    return function (req, res, next) {
      const permissions = req.session.permissions || [];

      const isAllowedPermission = permissions.find(
        (permission) => `/${roleName}${permission}` === req.originalUrl,
      );

      if (isAllowedPermission) {
        return next();
      } else {
        return res.redirect(`/${roleName}/dashboard`);
      }
    };
  },
};
