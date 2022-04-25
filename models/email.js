/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * email Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { intersection } = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    "email",
    {
			slug: DataTypes.STRING,
			subject: DataTypes.TEXT,
			tag: DataTypes.TEXT,
			html: DataTypes.TEXT,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "email",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Email);

  Email._preCreateProcessing = function (data) {

    return data;
  };
  Email._postCreateProcessing = function (data) {

    return data;
  };
  Email._customCountingConditions = function (data) {

    return data;
  };

  Email._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Email.allowFields();
    allowedFields.push(Email._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Email.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  Email.associate = function(models) {  };
  

        Email.type_mapping = function (type) {
          const mapping = {"0":"Forgot_token","1":"Access token","2":"Refresh_token","3":"Other","4":"Api Key","5":"Api Secret","6":"Verify"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[type];
        };
        

  Email.allowFields = function () {
    return ['slug','subject','tag','html',];
  };

  Email.labels = function () {
    return ['Email Type','Subject','Replacement Tags','Email Body',];
  };

  Email.validationRules = function () {
    return [
    	['slug', 'Email Type', 'required|is_unique[email.slug]'],
			['subject', 'Subject', 'required'],
			['tag', 'Replacement Tags', 'required'],
			['html', 'Email Body', 'required'],
		];
  };

  Email.validationEditRules = function () {
    return [
    	['slug', 'Email Type', ''],
			['subject', 'Subject', 'required'],
			['tag', 'Replacement Tags', ''],
			['html', 'Email Body', 'required'],
		];
  };


 

 
 
  // ex
  Email.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'slug','subject','tag','html','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Email;
};
