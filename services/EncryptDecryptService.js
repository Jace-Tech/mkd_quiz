const crypto = require('crypto');

module.exports = {
  iv: crypto.randomBytes(16).toString('hex').slice(0, 16),
  encrypt: function (message, secret) {
    const encrypter = crypto.createCipheriv('aes-256-cbc', secret, this.iv);
    let encryptMessage = encrypter.update(message, 'utf-8', 'hex');
    return (encryptMessage += encrypter.final('hex'));
  },
  decrypt: function (encryptMessage, secret) {
    const decrypter = crypto.createDecipheriv('aes-256-cbc', secret, this.iv);
    let decryptedMessage = decrypter.update(encryptMessage, 'hex', 'utf8');
    return (decryptedMessage += decrypter.final('utf8'));
  },
};
