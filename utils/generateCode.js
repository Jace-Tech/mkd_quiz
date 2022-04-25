/**
 * Generate random code with given length
 * @param {Number} length code length
 * @returns {String} Generated code
 * @example
 * generateCode(6)
 */
module.exports = function generateCode(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
