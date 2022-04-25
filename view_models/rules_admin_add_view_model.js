'use strict'


/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Rules Add View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

 const db = require('../models')
 let AuthService = require('../services/AuthService');


module.exports = function (entity, pageName='', success, error, base_url = "" ) {

  this._entity = entity;
  this.session = null;

  this.success = success || null;
  this.error = error || null;

  this._base_url = base_url;
  
  

  this.get_page_name = () => pageName;

  this.endpoint = "/admin/rules"


  this.heading =  "Add rule"

  this.action = "/admin/rules-add"

  

  this.form_fields = {"output_variable_name":"","actives":"","operator":"","compare_value":"","min":"","max":"","action":""}  

  
	this.operator_mapping = function () {
		return this._entity.operator_mapping();

	}

	this.action_mapping = function () {
		return this._entity.action_mapping();

	}


  return this;
}
