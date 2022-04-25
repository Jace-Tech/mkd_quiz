"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.role) {
    return parent.role;
  } else {
    return parent.getRole();
  }
};
