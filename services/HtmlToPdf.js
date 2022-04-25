const html_to_pdf = require('html-pdf-node');

module.exports = {
  html_to_pdf_with_content: async function (content, options) {
    const file = { content };

    return new Promise(function (resolve, reject) {
      html_to_pdf
        .generatePdf(file, options)
        .then((pdfBuffer) => {
          resolve(pdfBuffer);
        })
        .catch((error) => reject(error));
    });
  },
  html_to_pdf_with_url: async function (url, options) {
    const file = { url };

    return new Promise(function (resolve, reject) {
      html_to_pdf
        .generatePdf(file, options)
        .then((pdfBuffer) => {
          resolve(pdfBuffer);
        })
        .catch((error) => reject(error));
    });
  },
};

// pdf to html https://www.npmjs.com/package/pdf2html
