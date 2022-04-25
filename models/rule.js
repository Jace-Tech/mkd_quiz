/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * rule Model
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
  const Rule = sequelize.define(
    "rule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      output_variable_name: DataTypes.STRING,
      actives: DataTypes.TEXT,
      operator: DataTypes.INTEGER,
      compare_value: DataTypes.FLOAT,
      min: DataTypes.FLOAT,
      max: DataTypes.FLOAT,
      action: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "rule",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Rule);

  Rule._preCreateProcessing = function (data) {
    return data;
  };
  Rule._postCreateProcessing = function (data) {
    return data;
  };
  Rule._customCountingConditions = function (data) {
    return data;
  };

  Rule._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Rule.allowFields();
    allowedFields.push(Rule._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Rule.timeDefaultMapping = function () {
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

  Rule.associate = function (models) {};

  Rule.operator_mapping = function (operator) {
    const mapping = { 0: "=:equal", 1: "<:less than", 2: "<=:less than or equal", 3: ">:greater than", 4: ">=:greater than or equal", 5: "!=:not equal", 6: "in:between" };

    if (arguments.length === 0) return mapping;
    else return mapping[operator];
  };

  Rule.action_mapping = function (action) {
    const mapping = { 1: "add", 2: "remove" };

    if (arguments.length === 0) return mapping;
    else return mapping[action];
  };

  Rule.allowFields = function () {
    return ["id", "output_variable_name", "actives", "operator", "compare_value", "min", "max", "action"];
  };

  Rule.labels = function () {
    return ["ID", "Output variable", "actives", "Condition operator", "Compare value", "Between Min", "Between Max", "Action"];
  };

  Rule.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["output_variable_name", "Output variable", "required"],
      ["actives", "actives", "required"],
      ["operator", "Condition operator", "required"],
      ["compare_value", "Compare value", "required"],
      ["min", "Between Min", ""],
      ["max", "Between Max", ""],
      ["action", "Action", "required"],
    ];
  };

  Rule.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["output_variable_name", "Output variable", "required"],
      ["actives", "actives", "required"],
      ["operator", "Condition operator", "required"],
      ["compare_value", "Compare value", "required"],
      ["min", "Between Min", ""],
      ["max", "Between Max", ""],
      ["action", "Action", "required"],
    ];
  };

  // ex
  Rule.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "output_variable_name", "actives", "operator", "compare_value", "min", "max", "action", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Rule;
};
