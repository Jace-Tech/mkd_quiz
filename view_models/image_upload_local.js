'use strict'


/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * image_upload_local Image View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */


module.exports = function (entity, pageName='', success, error ) {

  this.entity = entity

  this.success = success || null
  this.error = error || null

  this.endpoint = "{{{route}}}"

  this.get_page_name = () => pageName


  this.create_resource = function(data) {
    return this.entity.insert(data)
  }

  this.upload_resource = function (req, res) {
    const filename = nanoid();

    const upload = uploader.local_upload('/uploads', 'image').single('image')

    upload(req, res, function (error) {
      if (error) throw new Error(error);
    });

    return filename;
  };

  return this
}
