/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * result_profile Model
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
  const Result_profile = sequelize.define(
    "result_profile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      section_title: DataTypes.STRING,
      output_variable_list: DataTypes.TEXT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "result_profile",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Result_profile);

  Result_profile._preCreateProcessing = function (data) {
    return data;
  };
  Result_profile._postCreateProcessing = function (data) {
    return data;
  };
  Result_profile._customCountingConditions = function (data) {
    return data;
  };

  Result_profile._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Result_profile.allowFields();
    allowedFields.push(Result_profile._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Result_profile.timeDefaultMapping = function () {
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

  Result_profile.associate = function (models) {};

  Result_profile.allowFields = function () {
    return ["id", "section_title", "output_variable_list"];
  };

  Result_profile.labels = function () {
    return ["ID", "Section title", "Variables List"];
  };

  Result_profile.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["section_title", "Section title", ""],
      ["output_variable_list", "Variables List", ""],
    ];
  };

  Result_profile.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["section_title", "Section title", ""],
      ["output_variable_list", "Variables List", ""],
    ];
  };

  // ex
  Result_profile.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "section_title", "output_variable_list", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Result_profile;
};
