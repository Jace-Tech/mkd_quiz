"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.referrer_user) {
    return parent.referrer_user;
  } else {
    return parent.getReferrerUser();
  }
};
