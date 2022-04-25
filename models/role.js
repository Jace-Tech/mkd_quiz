/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * role Model
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
  const Role = sequelize.define(
    "role",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			name: DataTypes.STRING,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "role",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Role);

  Role._preCreateProcessing = function (data) {

    return data;
  };
  Role._postCreateProcessing = function (data) {

    return data;
  };
  Role._customCountingConditions = function (data) {

    return data;
  };

  Role._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Role.allowFields();
    allowedFields.push(Role._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Role.timeDefaultMapping = function () {
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

  Role.associate = function(models) { 	
Role.hasMany(models.user, {
                foreignKey: "user_id",
                as: "users",
                constraints: false,
              }) };
  


  Role.allowFields = function () {
    return ["user_id",'id','name',];
  };

  Role.labels = function () {
    return ['ID','Role Name',];
  };

  Role.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Role Name', 'required'],
		];
  };

  Role.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Role Name', 'required'],
		];
  };


 	
Role.get_user_paginated = function(db, where = {}, ...rest) {
        return Role.getPaginated(...rest, [{
          model: db.user,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "users",   
        }])
      }	


 Role.get_role_user = (id, db) => {
      return Role.findByPk(id, 
        { 
          include: [
            { 
              model: db.user,
              required: false,  
              as: "users",   
            }
          ] 
        });
    };
 
  // ex
  Role.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','name','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Role;
};
