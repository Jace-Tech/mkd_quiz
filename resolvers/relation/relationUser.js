"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.user) {
    return parent.user;
  } else {
    return parent.getUser();
  }
};
