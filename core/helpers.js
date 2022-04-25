const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
module.exports = {
  filterEmptyFields(object) {
    Object.keys(object).forEach((key) => {
      if (this.empty(object[key])) {
        delete object[key];
      }
    });
    return object;
  },
  empty(value) {
    return value === '' || value === null || value === undefined;
  },
  getMappingKey(mappingFunction, value) {
    return Object.keys(mappingFunction()).find((key) => mappingFunction()[key].toLowerCase() === value.toLowerCase());
  },
  checkFor(requiredFields) {
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new Error(`Must provide ${key}`);
      }
    }
    return true;
  },
  convertToCents(amount) {
    return parseFloat(amount) * 100;
  },
  convertFromCents(amount) {
    return parseFloat(amount) / 100;
  },
  inject_substitute(text, normalKey, value) {
    text = text.replace(new RegExp('{{{' + normalKey + '}}}', 'g'), value);
    return text;
  },
  createDirectoriesRecursive(filePath) {
    let fileDirectoryPath = path.dirname(filePath);
    if (!fs.existsSync(fileDirectoryPath)) {
      fs.mkdirSync(fileDirectoryPath, { recursive: true });
    }
  },
  createDirectoriesRecursiveV2(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  },
  sanitizeInputs(body) {
    if (Array.isArray(body)) {
      body.forEach((item) => {
        item = sanitizeHtml(item);
      });
      return body;
    }
    if (this.isObject(body)) {
      Object.keys(body).forEach((key) => {
        body[key] = sanitizeHtml(body[key]);
      });
      return body;
    }
    return sanitizeHtml(body);
  },
  isObject(obj) {
    return obj === Object(obj);
  },
  ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  getLocalPath(string) {
    if (string.includes('\\')) {
      return string.split('\\public')[1].replace(/\\/g, '/');
    } else {
      return string.split('/public')[1];
    }
  },
};
