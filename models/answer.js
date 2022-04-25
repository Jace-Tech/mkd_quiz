/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * answer Model
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
  const Answer = sequelize.define(
    "answer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
      answer: DataTypes.TEXT,
      answer_value: DataTypes.FLOAT,
      hide_answer: DataTypes.BOOLEAN,
      explaination: DataTypes.TEXT,
      image_id: DataTypes.TEXT,
      response_header: DataTypes.TEXT,
      response_body: DataTypes.TEXT,
      response_arguments: DataTypes.TEXT,
      black_list_actives: DataTypes.TEXT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "answer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Answer);

  Answer._preCreateProcessing = function (data) {
    return data;
  };
  Answer._postCreateProcessing = function (data) {
    return data;
  };
  Answer._customCountingConditions = function (data) {
    return data;
  };

  Answer._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Answer.allowFields();
    allowedFields.push(Answer._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Answer.timeDefaultMapping = function () {
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

  Answer.associate = function (models) {
    Answer.belongsTo(models.question, {
      foreignKey: "question_id",
      as: "question",
      constraints: false,
    });
    Answer.belongsTo(models.image, {
      foreignKey: "image_id",
      as: "image",
      constraints: false,
    });
  };

  Answer.allowFields = function () {
    return ["id", "question_id", "order", "answer", "answer_value", "hide_answer", "explaination", "image_id", "response_header", "response_body", "response_arguments", "black_list_actives"];
  };

  Answer.labels = function () {
    return ["ID", "Question ID", "Order", "Answer", "Answer value", "Hide answer", "Explaination", "Image ID", "Response header", "Response body", "Response arguments", "Black listed actives"];
  };

  Answer.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["question_id", "Question ID", "required"],
      ["order", "Order", "required"],
      ["answer", "Answer", "required"],
      ["answer_value", "Answer value", ""],
      ["hide_answer", "Hide answer", ""],
      ["explaination", "Explaination", ""],
      ["image_id", "Image ID", ""],
      ["response_header", "Response header", ""],
      ["response_body", "Response body", ""],
      ["response_arguments", "Response arguments", ""],
      ["black_list_actives", "Black listed actives", ""],
    ];
  };

  Answer.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["question_id", "Question ID", "required"],
      ["order", "Order", "required"],
      ["answer", "Answer", "required"],
      ["answer_value", "Answer value", ""],
      ["hide_answer", "Hide answer", ""],
      ["explaination", "Explaination", ""],
      ["image_id", "Image ID", ""],
      ["response_header", "Response header", ""],
      ["response_body", "Response body", ""],
      ["response_arguments", "Response arguments", ""],
      ["black_list_actives", "Black listed actives", ""],
    ];
  };

  Answer.get_question_paginated = function (db, where = {}, ...rest) {
    return Answer.getPaginated(...rest, [
      {
        model: db.question,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "question",
      },
    ]);
  };

  Answer.get_image_paginated = function (db, where = {}, ...rest) {
    return Answer.getPaginated(...rest, [
      {
        model: db.image,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "image",
      },
    ]);
  };

  Answer.get_answer_question = (id, db) => {
    return Answer.findByPk(id, {
      include: [
        {
          model: db.question,
          required: false,
          as: "question",
        },
      ],
    });
  };
  Answer.get_answer_image = (id, db) => {
    return Answer.findByPk(id, {
      include: [
        {
          model: db.image,
          required: false,
          as: "image",
        },
      ],
    });
  };

  // ex
  Answer.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          "id",
          "question_id",
          "order",
          "answer",
          "answer_value",
          "hide_answer",
          "explaination",
          "image_id",
          "response_header",
          "response_body",
          "response_arguments",
          "black_list_actives",
          "created_at",
          "updated_at",
        ],
        Object.keys(fields)
      );
    } else return [];
  };

  return Answer;
};
