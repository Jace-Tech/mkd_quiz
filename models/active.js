/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * active Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { intersection } = require("lodash");
const coreModel = require("./../core/models");

module.exports = (sequelize, DataTypes) => {
  const Active = sequelize.define(
    "active",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      handle: DataTypes.TEXT,
      description: DataTypes.TEXT,
      variables_scores: DataTypes.TEXT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "active",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Active);

  Active._preCreateProcessing = function (data) {
    return data;
  };
  Active._postCreateProcessing = function (data) {
    return data;
  };
  Active._customCountingConditions = function (data) {
    return data;
  };

  Active._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Active.allowFields();
    allowedFields.push(Active._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Active.timeDefaultMapping = function () {
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

  Active.associate = function (models) {};

  Active.allowFields = function () {
    return ["id", "name", "handle", "variables_scores", "description"];
  };

  Active.labels = function () {
    return ["ID", "Name", "Handle", "Variables scores", "Description"];
  };

  Active.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["variables_scores", "Variables scores", ""],
      ["description", "Description", ""],
    ];
  };

  Active.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["variables_scores", "Variables scores", ""],
      ["description", "Description", ""],
    ];
  };

  // ex
  Active.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "name", "handle", "variables_scores", "description", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Active;
};
