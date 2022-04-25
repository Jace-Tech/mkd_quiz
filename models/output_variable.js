/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * output_variable Model
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
  const Output_variable = sequelize.define(
    "output_variable",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      priority: DataTypes.FLOAT,
      active_list: DataTypes.TEXT,
      ranges_response: DataTypes.TEXT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "output_variable",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Output_variable);

  Output_variable._preCreateProcessing = function (data) {
    return data;
  };
  Output_variable._postCreateProcessing = function (data) {
    return data;
  };
  Output_variable._customCountingConditions = function (data) {
    return data;
  };

  Output_variable._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Output_variable.allowFields();
    allowedFields.push(Output_variable._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Output_variable.timeDefaultMapping = function () {
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

  Output_variable.associate = function (models) {};

  Output_variable.allowFields = function () {
    return ["id", "name", "priority", "active_list", "ranges_response"];
  };

  Output_variable.labels = function () {
    return ["ID", "Name", "Priority", "Actives list", "Ranges responses"];
  };

  Output_variable.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["priority", "Priority", "required"],
      ["active_list", "Actives list", "required"],
      ["ranges_response", "Ranges responses", "required"],
    ];
  };

  Output_variable.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["priority", "Priority", "required"],
      ["active_list", "Actives list", "required"],
      ["ranges_response", "Ranges responses", "required"],
    ];
  };

  // ex
  Output_variable.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "name", "priority", "active_list", "ranges_response", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Output_variable;
};
