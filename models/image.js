/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * image Model
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
  const Image = sequelize.define(
    "image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: DataTypes.TEXT,
      caption: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      mobile_width: DataTypes.INTEGER,
      mobile_height: DataTypes.INTEGER,
      upload_type: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "image",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Image);

  Image._preCreateProcessing = function (data) {
    return data;
  };
  Image._postCreateProcessing = function (data) {
    return data;
  };
  Image._customCountingConditions = function (data) {
    return data;
  };

  Image._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Image.allowFields();
    allowedFields.push(Image._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Image.timeDefaultMapping = function () {
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

  Image.associate = function (models) {
    Image.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    });
    Image.hasOne(models.configuration, {
      foreignKey: "image_id",
      as: "configuration",
      constraints: false,
    });
    Image.hasMany(models.answer, {
      foreignKey: "image_id",
      as: "answers",
      constraints: false,
    });
  };

  Image.upload_type_mapping = function (upload_type) {
    const mapping = { 0: "Server Hosted", 1: "External Link", 2: "S3", 3: "Cloudinary", 4: "File", 5: "External File", 6: "Local Hosted" };

    if (arguments.length === 0) return mapping;
    else return mapping[upload_type];
  };

  Image.allowFields = function () {
    return ["image_id", "id", "url", "caption", "user_id", "width", "height", "mobile_width", "mobile_height", "upload_type"];
  };

  Image.labels = function () {
    return ["ID", "URL", "Caption", "User", "Width", "Height", "Mobile width", "Mobile height", "Upload Type"];
  };

  Image.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["url", "URL", "required"],
      ["caption", "Caption", ""],
      ["user_id", "User", ""],
      ["width", "Width", ""],
      ["height", "Height", ""],
      ["mobile_width", "Mobile width", ""],
      ["mobile_height", "Mobile height", ""],
      ["upload_type", "Upload Type", ""],
    ];
  };

  Image.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["url", "URL", "required"],
      ["caption", "Caption", ""],
      ["user_id", "User", ""],
      ["width", "Width", ""],
      ["height", "Height", ""],
      ["mobile_width", "Mobile width", ""],
      ["mobile_height", "Mobile height", ""],
      ["upload_type", "Upload Type", ""],
    ];
  };

  Image.get_user_paginated = function (db, where = {}, ...rest) {
    return Image.getPaginated(...rest, [
      {
        model: db.user,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "user",
      },
    ]);
  };

  Image.get_answer_paginated = function (db, where = {}, ...rest) {
    return Image.getPaginated(...rest, [
      {
        model: db.answer,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "answers",
      },
    ]);
  };

  Image.get_image_user = (id, db) => {
    return Image.findByPk(id, {
      include: [
        {
          model: db.user,
          required: false,
          as: "user",
        },
      ],
    });
  };
  Image.get_image_answer = (id, db) => {
    return Image.findByPk(id, {
      include: [
        {
          model: db.answer,
          required: false,
          as: "answers",
        },
      ],
    });
  };

  // ex
  Image.intersection = function (fields) {
    if (fields) {
      return intersection(["id", "url", "caption", "user_id", "width", "height", "mobile_width", "mobile_height", "upload_type", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Image;
};
