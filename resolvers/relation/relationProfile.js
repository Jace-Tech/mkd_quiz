"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.profile) {
    return parent.profile;
  } else {
    return parent.getProfile();
  }
};
