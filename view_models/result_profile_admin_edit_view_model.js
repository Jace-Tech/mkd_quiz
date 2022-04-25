'use strict'
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Result_profile Edit View Model
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

  this.endpoint = "/admin/profile-sections"

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

  this.heading = "Edit result profile"

  this.action = "/admin/profile-sections-edit"
  
  
  

  this.form_fields = {"section_title":"","output_variable_list":"","id":""}

  


  return this;
}
