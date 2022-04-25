const barcode = require('barcode');

module.exports = {
  /**
   * Generate barcode
   * @param {string} string barcode text
   * @param {{width?: number, height?: number}} param1 width and height for barcode image
   * @returns {Promise.<string>}
   */
  generateBarcode: async function (string, { width = 400, height = 100 }) {
    return new Promise((resolve, reject) => {
      const code128 = barcode('Code128', {
        data: string,
        width,
        height,
      });

      code128.getBase64(function (error, base64String) {
        if (error) reject(error);
        else resolve(base64String);
      });
    });
  },
};
