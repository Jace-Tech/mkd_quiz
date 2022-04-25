/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * quiz Model
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
  const Quiz = sequelize.define(
    "quiz",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			name: DataTypes.STRING,
			description: DataTypes.TEXT,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "quiz",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Quiz);

  Quiz._preCreateProcessing = function (data) {

    return data;
  };
  Quiz._postCreateProcessing = function (data) {

    return data;
  };
  Quiz._customCountingConditions = function (data) {

    return data;
  };

  Quiz._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Quiz.allowFields();
    allowedFields.push(Quiz._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Quiz.timeDefaultMapping = function () {
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

  Quiz.associate = function(models) { 	
Quiz.hasMany(models.question, {
                foreignKey: "quiz_id",
                as: "questions",
                constraints: false,
              }) };
  


  Quiz.allowFields = function () {
    return ["quiz_id",'id','name','description',];
  };

  Quiz.labels = function () {
    return ['ID','Name','Description',];
  };

  Quiz.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Name', 'required'],
			['description', 'Description', ''],
		];
  };

  Quiz.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['name', 'Name', 'required'],
			['description', 'Description', ''],
		];
  };


 	
Quiz.get_question_paginated = function(db, where = {}, ...rest) {
        return Quiz.getPaginated(...rest, [{
          model: db.question,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "questions",   
        }])
      }	


 Quiz.get_quiz_question = (id, db) => {
      return Quiz.findByPk(id, 
        { 
          include: [
            { 
              model: db.question,
              required: false,  
              as: "questions",   
            }
          ] 
        });
    };
 
  // ex
  Quiz.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','name','description','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Quiz;
};
