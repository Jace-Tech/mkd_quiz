const QRCode = require('qrcode');

module.exports = {
  /**
   * Generate QRCode
   * @param {string} text QRCode string
   */
  generateQRCode: async function (text) {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(text, (error, url) => {
        if (error) reject(error);
        else resolve(url);
      });
    });
  },
};
