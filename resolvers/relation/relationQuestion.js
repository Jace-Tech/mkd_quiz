"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.question) {
    return parent.question;
  } else {
    return parent.getQuestion();
  }
};
