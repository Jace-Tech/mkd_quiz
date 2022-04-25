'use strict'

/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Rules V View Model
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

  this.endpoint = "/admin/rules"

  this.get_page_name = () => pageName

  this.heading = "Rule details"


  this.detail_fields = {"id":"","output_variable_name":"","actives":"","operator":"","compare_value":"","min":"","max":"","action":""}


  return this;
}
