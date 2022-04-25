'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/

/**
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const db = require('../models');

AWS.config.update({
  accessKeyId: process.env.DYNAMIC_CONFIG_AWS_KEY,
  secretAccessKey: process.env.DYNAMIC_CONFIG_AWS_SECRET,
  region: process.env.DYNAMIC_CONFIG_AWS_REGION,
});

async function main() {
  /** @type {Array.<{url: string}>} */
  const images = await db.image.getAllByStatus(0);

  const mapKeys = images.map(({ url }) => {
    // TODO: DO MAPPING
    return url;
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Delete: { Objects: mapKeys },
  };

  S3.deleteObjects(params, (error, data) => {
    if (error) console.log(error);
    else console.log(data);
  });
}

main();
