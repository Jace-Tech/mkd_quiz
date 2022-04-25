/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * member_operation Model
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
  const Member_operation = sequelize.define(
    "member_operation",
    {
			action: DataTypes.STRING,
			detail: DataTypes.TEXT,
			last_ip: DataTypes.STRING,
			user_agent: DataTypes.STRING,
			status: DataTypes.INTEGER,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "member_operation",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Member_operation);

  Member_operation._preCreateProcessing = function (data) {
if(!data.status) data.status = 1;
    return data;
  };
  Member_operation._postCreateProcessing = function (data) {

    return data;
  };
  Member_operation._customCountingConditions = function (data) {

    return data;
  };

  Member_operation._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Member_operation.allowFields();
    allowedFields.push(Member_operation._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Member_operation.timeDefaultMapping = function () {
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

  Member_operation.associate = function(models) { 	
Member_operation.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
                constraints: false,
              }) };
  

        Member_operation.status_mapping = function (status) {
          const mapping = {"0":"Inactive","1":"Active"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[status];
        };
        

  Member_operation.allowFields = function () {
    return ["user_id",'action','detail','last_ip','user_agent','status',];
  };

  Member_operation.labels = function () {
    return ['Action','Detail','Last IP','User Agent','Status',];
  };

  Member_operation.validationRules = function () {
    return [
    	['action', 'Action', 'required|max[50]'],
			['detail', 'Detail', 'required'],
			['last_ip', 'Last IP', 'required'],
			['user_agent', 'User Agent', 'required'],
			['status', 'Status', 'required|integer'],
		];
  };

  Member_operation.validationEditRules = function () {
    return [
    	['action', 'Action', ''],
			['detail', 'Detail', ''],
			['last_ip', 'Last IP', ''],
			['user_agent', 'User Agent', ''],
			['status', 'Status', 'required|integer'],
		];
  };


 	
Member_operation.get_user_paginated = function(db, where = {}, ...rest) {
        return Member_operation.getPaginated(...rest, [{
          model: db.user,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "user",   
        }])
      }	


 Member_operation.get_member_operation_user = (id, db) => {
      return Member_operation.findByPk(id, 
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
  Member_operation.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'action','detail','last_ip','user_agent','status','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Member_operation;
};
