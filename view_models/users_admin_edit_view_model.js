'use strict'
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Users Edit View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */
 const db = require('../models');

module.exports = function (entity, pageName='', success, error, base_url = "") {

  this._entity = entity
  this.session  = null

  this.success = success || null
  this.error = error || null

  this._base_url = base_url

  this.endpoint = "/admin/users"

  this.get_page_name = () => pageName

  this.format_date_input = function(date){
    const d = new Date(date) 
    const year = d.getFullYear();
    const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1 }` : d.getMonth() + 1 ;
    const day = d.getDate() < 10 ? `0${d.getDate() }` : d.getDate() ;
    return `${year}-${month}-${day}`
  }
  
  this.format_date_local_input = function(date){
    const d = new Date(date) 
    const year = d.getFullYear();
    const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1 }` : d.getMonth() + 1 ;
    const day = d.getDate() < 10 ? `0${d.getDate() }` : d.getDate() ;
    const hrs = d.getHours() < 10 ? `0${d.getHours() }` : d.getHours() ;
    const mins = d.getMinutes() < 10 ? `0${d.getMinutes() }` : d.getMinutes() ;
    return `${year}-${month}-${day}T${hrs}:${mins}`
  }

  this.heading = "Edit user"

  this.action = "/admin/users-edit"
  
  
  

  this.form_fields = {"credential.email":"","credential.password":"","first_name":"","last_name":"","role_id":"","image":"","phone":"","status":"","id":""}

  
	this.status_mapping = function () {
		return this._entity.status_mapping();

	}



  return this;
}
