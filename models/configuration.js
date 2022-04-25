/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * configuration Model
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
  const Configuration = sequelize.define(
    "configuration",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image_id: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "configuration",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Configuration);

  Configuration._preCreateProcessing = function (data) {
    return data;
  };
  Configuration._postCreateProcessing = function (data) {
    return data;
  };
  Configuration._customCountingConditions = function (data) {
    return data;
  };

  Configuration._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Configuration.allowFields();
    allowedFields.push(Configuration._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Configuration.timeDefaultMapping = function () {
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

  Configuration.associate = function (models) {
    Configuration.belongsTo(models.image, {
      foreignKey: "image_id",
      as: "image",
      constraints: false,
    });
  };

  Configuration.allowFields = function () {
    return ["id", "image_id"];
  };

  Configuration.labels = function () {
    return ["ID", "Image"];
  };

  Configuration.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["image_id", "Image", "required"],
    ];
  };

  Configuration.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["image_id", "Image", "required"],
    ];
  };

  // ex
  Configuration.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "image_id", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Configuration;
};
