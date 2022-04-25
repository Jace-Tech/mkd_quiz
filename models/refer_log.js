/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * refer_log Model
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
  const Refer_log = sequelize.define(
    "refer_log",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			user_id: DataTypes.INTEGER,
			referrer_user_id: DataTypes.INTEGER,
			type: DataTypes.INTEGER,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "refer_log",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Refer_log);

  Refer_log._preCreateProcessing = function (data) {

    return data;
  };
  Refer_log._postCreateProcessing = function (data) {

    return data;
  };
  Refer_log._customCountingConditions = function (data) {

    return data;
  };

  Refer_log._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Refer_log.allowFields();
    allowedFields.push(Refer_log._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Refer_log.timeDefaultMapping = function () {
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

  Refer_log.associate = function(models) { 	
Refer_log.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
                constraints: false,
              }) };
  

        Refer_log.type_mapping = function (type) {
          const mapping = {"0":"user"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[type];
        };
        

  Refer_log.allowFields = function () {
    return ['id','user_id','referrer_user_id','type',];
  };

  Refer_log.labels = function () {
    return ['ID','Referree User','Referrer User','Type',];
  };

  Refer_log.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['user_id', 'Referree User', 'required|integer'],
			['referrer_user_id', 'Referrer User', 'required|integer'],
			['type', 'Type', 'required|integer'],
		];
  };

  Refer_log.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['user_id', 'Referree User', ''],
			['referrer_user_id', 'Referrer User', ''],
			['type', 'Type', 'required|integer'],
		];
  };


 	
Refer_log.get_user_paginated = function(db, where = {}, ...rest) {
        return Refer_log.getPaginated(...rest, [{
          model: db.user,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "user",   
        }])
      }	


 Refer_log.get_refer_log_user = (id, db) => {
      return Refer_log.findByPk(id, 
        { 
          include: [
            { 
              model: db.user,
              required: false,  
              as: "user",   
            }
          ] 
        });
    };
 
  // ex
  Refer_log.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','user_id','referrer_user_id','type','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Refer_log;
};
