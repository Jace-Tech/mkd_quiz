'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/

/**
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

const archiver = require('archiver');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const stream = require('stream');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.DYNAMIC_CONFIG_AWS_KEY,
  secretAccessKey: process.env.DYNAMIC_CONFIG_AWS_SECRET,
  region: process.env.DYNAMIC_CONFIG_AWS_REGION,
});

const main = async () => {
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  archive.directory(path.join(__dirname, '../../', '/uploads'), false);

  const uploadStream = new stream.PassThrough();
  archive.pipe(uploadStream);
  archive.finalize();

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.on('end', function () {
    console.log('archive end');
  });

  await uploadFromStream(uploadStream);
  console.log('all done');
};

const uploadFromStream = async (pass) => {
  const s3params = {
    Bucket: process.env.DYNAMIC_CONFIG_AWS_BUCKET,
    Key: `uploads.zip`,
    Body: pass,
    ContentType: 'application/zip',
  };
  return s3.upload(s3params).promise();
};

main();
