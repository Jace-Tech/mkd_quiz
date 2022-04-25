const path = require('path');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { createDirectoriesRecursiveV2 } = require('./../core/helpers');

module.exports = {
  upload: function (location) {
    if (process.env.NODE_ENV === 'production') {
      return this.s3_upload(location);
    } else {
      return this.local_upload('');
    }
  },
  s3_upload: function (location) {
    try {
      aws.config.update({
        accessKeyId: process.env.DYNAMIC_CONFIG_AWS_KEY,
        secretAccessKey: process.env.DYNAMIC_CONFIG_AWS_SECRET,
        region: process.env.DYNAMIC_CONFIG_AWS_REGION,
      });

      const s3 = new aws.S3();

      const upload = multer({
        storage: multerS3({
          s3: s3,
          bucket: process.env.DYNAMIC_CONFIG_AWS_BUCKET,
          acl: 'public-read',
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: function (req, file, cb) {
            cb(null, location + file.originalname);
          },
        }),
      });

      return upload;
    } catch (error) {
      console.log('s3_upload => ', error);
    }
  },
  local_upload: function () {
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          createDirectoriesRecursiveV2(path.join(__dirname, '..', 'public', 'uploads'));
          cb(null, path.join(__dirname, '..', 'public', 'uploads'));
        },
        filename: function (req, file, cb) {
          const fileName = file.filename ?? file.originalname;
          cb(null, Date.now() + '-' + fileName);
        },
      });

      const upload = multer({ storage: storage });

      return upload;
    } catch (error) {
      console.log('local_upload => ', error);
    }
  },
};
