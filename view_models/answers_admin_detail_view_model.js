'use strict'

/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Answers V View Model
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

  this.endpoint = "/admin/answers"

  this.get_page_name = () => pageName

  this.heading = "Answer details"


  this.detail_fields = {"id":"","question_id":"","question.question":"","answer":"","answer_value":"","explaination":"","image_id":"","response_header":"","response_body":"","response_arguments":"","black_list_actives":""}


  return this;
}
