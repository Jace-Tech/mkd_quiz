"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.image) {
    return parent.image;
  } else {
    return parent.getImage();
  }
};
