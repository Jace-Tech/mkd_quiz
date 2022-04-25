/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * setting Model
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
  const Setting = sequelize.define(
    "setting",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			key: DataTypes.STRING,
			type: DataTypes.INTEGER,
			value: DataTypes.TEXT,
			maintenance: DataTypes.INTEGER,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "setting",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Setting);

  Setting._preCreateProcessing = function (data) {

    return data;
  };
  Setting._postCreateProcessing = function (data) {

    return data;
  };
  Setting._customCountingConditions = function (data) {

    return data;
  };

  Setting._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Setting.allowFields();
    allowedFields.push(Setting._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Setting.timeDefaultMapping = function () {
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

  Setting.associate = function(models) {  };
  

        Setting.type_mapping = function (type) {
          const mapping = {"0":"text","1":"select","2":"number","3":"image","4":"read_only"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[type];
        };
        

        Setting.maintenance_mapping = function (maintenance) {
          const mapping = {"0":"No","1":"Yes"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[maintenance];
        };
        

  Setting.allowFields = function () {
    return ['id','key','type','value','maintenance',];
  };

  Setting.labels = function () {
    return ['ID','Setting Field','Setting Type','Setting Value','Setting Type',];
  };

  Setting.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['key', 'Setting Field', 'required'],
			['type', 'Setting Type', 'required'],
			['value', 'Setting Value', 'required'],
			['maintenance', 'Setting Type', 'required'],
		];
  };

  Setting.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['key', 'Setting Field', ''],
			['type', 'Setting Type', ''],
			['value', 'Setting Value', 'required'],
			['maintenance', 'Setting Type', ''],
		];
  };


 

 
 
  // ex
  Setting.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','key','type','value','maintenance','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Setting;
};
