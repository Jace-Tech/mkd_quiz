"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.quiz) {
    return parent.quiz;
  } else {
    return parent.getQuiz();
  }
};
