"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.organization) {
    return parent.organization;
  } else {
    return parent.getOrganization();
  }
};
