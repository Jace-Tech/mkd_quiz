/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * activity_log Model
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
  const Activity_log = sequelize.define(
    "activity_log",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			name: DataTypes.STRING,
			action: DataTypes.STRING,
			data: DataTypes.TEXT,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "activity_log",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Activity_log);

  Activity_log._preCreateProcessing = function (data) {

    return data;
  };
  Activity_log._postCreateProcessing = function (data) {

    return data;
  };
  Activity_log._customCountingConditions = function (data) {

    return data;
  };

  Activity_log._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Activity_log.allowFields();
    allowedFields.push(Activity_log._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Activity_log.timeDefaultMapping = function () {
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

  Activity_log.associate = function(models) {  };
  


  Activity_log.allowFields = function () {
    return ['id','name','action','data',];
  };

  Activity_log.labels = function () {
    return ['ID','Name','Action','Data',];
  };

  Activity_log.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Name', ''],
			['action', 'Action', 'required'],
			['data', 'Data', 'required'],
		];
  };

  Activity_log.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Name', ''],
			['action', 'Action', 'required'],
			['data', 'Data', 'required'],
		];
  };


 

 
 
  // ex
  Activity_log.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','name','action','data','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Activity_log;
};
