"use strict";

/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Questions V View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

module.exports = function (entity, pageName = "", success, error, base_url = "") {
  this.entity = entity;

  this.success = success || null;
  this.error = error || null;

  this._base_url = base_url;

  this.endpoint = "/admin/questions";

  this.get_page_name = () => pageName;

  this.heading = "Question details";

  this.detail_fields = {
    id: "",
    "quiz.name": "",
    question: "",
    question_arguments: "",
    order: "",
    note: "",
    note_type: "",
    target: "",
    response: "",
    save_response_into: "",
    depends_on: "",
    slider_range: "",
    output_variable_name: "",
    weight: "",
    extra_output_variable: "",
    type: "",
  };

  return this;
};
