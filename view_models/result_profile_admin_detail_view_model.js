'use strict'

/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Result_profile V View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

module.exports = function (entity, pageName='', success, error, base_url = "" ) {

  this.entity = entity

  this.success = success || null
  this.error = error || null

  this._base_url  = base_url

  this.endpoint = "/admin/profile-sections"

  this.get_page_name = () => pageName

  this.heading = "Result profile details"


  this.detail_fields = {"id":"","section_title":"","output_variable_list":""}


  return this;
}
