require('dotenv').config();
const AWS = require('aws-sdk');

process.env.DYNAMIC_CONFIG_AWS_REGION = 'ap-south-1';
process.env.DYNAMIC_CONFIG_AWS_KEY = 'AKIA5RTSM74BBOL52JEA';
process.env.DYNAMIC_CONFIG_AWS_SECRET =
  '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';
process.env.DYNAMIC_CONFIG_AWS_BUCKET = 'sentry-test90426-dev';

class S3Service {
  /**
   * Initialize S3 service
   * @param {bucket} bucket override default aws bucket name
   */
  constructor(bucket) {
    AWS.config.update({
      accessKeyId: process.env.DYNAMIC_CONFIG_AWS_KEY,
      secretAccessKey: process.env.DYNAMIC_CONFIG_AWS_SECRET,
      region: process.env.DYNAMIC_CONFIG_AWS_REGION,
      signatureVersion: 'v4',
    });

    this.S3 = new AWS.S3();
    this.bucket = bucket || process.env.DYNAMIC_CONFIG_AWS_BUCKET;
  }

  /**
   * Upload an object to bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property s3.upload}
   * @param {string} key object key
   * @param {any} body object body
   * @param {AWS.S3.PutObjectRequest} options upload object params
   * @returns {Promise.<AWS.S3.Types.ManagedUpload.SendData>}
   * @throws {Error}
   */
  upload(key, body, options) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ...options,
    };

    return new Promise((resolve, reject) => {
      this.S3.upload(params, function (error, data) {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }

  /**
   * Upload objects to bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property s3.upload}
   * @param {[{key: string, body: any}]} objects objects key and body
   * @param {AWS.S3.PutObjectRequest} options upload objects params
   * @returns {Promise.<[AWS.S3.Types.ManagedUpload.SendData]>}
   * @throws {Error}
   */
  batchUpload(objects, options) {
    const uploads = [];

    objects.forEach((object) => {
      const singleUpload = this.upload(object.key, object.body, options);
      uploads.push(singleUpload);
    });

    return Promise.all(uploads);
  }

  /**
   * Get object from bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property s3.getObject}
   * @param {string} key object key
   * @param {AWS.S3.GetObjectRequest} options get object params
   * @returns {Promise.<AWS.S3.Types.GetObjectOutput>}
   * @throws {AWS.S3.Error}
   */
  get(key, options) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ...options,
    };

    return new Promise((resolve, reject) => {
      this.S3.getObject(params, function (error, data) {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }

  /**
   * Get objects from bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property s3.getObject}
   * @param {[key: string]} keys object keys
   * @param {AWS.S3.GetObjectRequest} options get objects params
   * @returns {Promise.<[AWS.S3.Types.GetObjectOutput]>}
   * @throws {AWS.S3.Error}
   */
  batchGet(keys, options) {
    const gets = [];

    keys.forEach((key) => {
      const singleGet = this.get(key, options);
      gets.push(singleGet);
    });

    return Promise.all(gets);
  }

  /**
   * Delete object from bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property s3.getObject}
   * @param {string} key object key
   * @param {AWS.S3.DeleteObjectRequest} options delete object params
   * @returns {Promise.<AWS.S3.Types.DeleteObjectOutput>}
   * @throws {AWS.S3.Error}
   */
  delete(key, options) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ...options,
    };

    return new Promise((resolve, reject) => {
      this.S3.deleteObject(params, function (error, data) {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }

  /**
   * Delete objects from bucket
   * {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property s3.getObjects}
   * @param {[string]} key objects key
   * @param {AWS.S3.DeleteObjectRequest} options delete objects params
   * @returns {Promise.<[AWS.S3.Types.DeleteObjectOutput]>}
   * @throws {AWS.S3.Error}
   */
  batchDelete(keys, options) {
    const deletes = [];

    keys.forEach((key) => {
      const singleDelete = this.delete(key, options);
      deletes.push(singleDelete);
    });

    return Promise.all(deletes);
  }
}

module.exports = S3Service;
