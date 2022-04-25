/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * question Model
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
  const Question = sequelize.define(
    "question",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quiz_id: DataTypes.INTEGER,
      question: DataTypes.TEXT,
      question_arguments: DataTypes.TEXT,
      order: DataTypes.INTEGER,
      image_width: DataTypes.FLOAT,
      image_height: DataTypes.FLOAT,
      placeholder: DataTypes.STRING,
      note: DataTypes.TEXT,
      note_type: DataTypes.INTEGER,
      target: DataTypes.INTEGER,
      response: DataTypes.TEXT,
      save_response_into: DataTypes.STRING,
      depends_on: DataTypes.STRING,
      slider_range: DataTypes.STRING,
      output_variable_name: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      extra_output_variable: DataTypes.TEXT,
      type: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "question",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Question);

  Question._preCreateProcessing = function (data) {
    return data;
  };
  Question._postCreateProcessing = function (data) {
    return data;
  };
  Question._customCountingConditions = function (data) {
    return data;
  };

  Question._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Question.allowFields();
    allowedFields.push(Question._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Question.timeDefaultMapping = function () {
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

  Question.associate = function (models) {
    Question.belongsTo(models.quiz, {
      foreignKey: "quiz_id",
      as: "quiz",
      constraints: false,
    });
    Question.hasMany(models.answer, {
      foreignKey: "question_id",
      as: "answers",
      constraints: false,
    });
  };

  Question.type_mapping = function (type) {
    const mapping = { 1: "text", 2: "number", 3: "date", 4: "mcq", 5: "mcqi", 6: "slide", 7: "selection", 8: "geolocation" };

    if (arguments.length === 0) return mapping;
    else return mapping[type];
  };

  Question.target_mapping = function (target) {
    const mapping = { 1: "female", 2: "male", 3: "non-binary", 4: "all" };

    if (arguments.length === 0) return mapping;
    else return mapping[target];
  };

  Question.note_type_mapping = function (note_type) {
    const mapping = { 1: "Note", 2: "Scientific note" };

    if (arguments.length === 0) return mapping;
    else return mapping[note_type];
  };

  Question.allowFields = function () {
    return [
      "question_id",
      "id",
      "quiz_id",
      "question",
      "question_arguments",
      "order",
      "image_width",
      "image_height",
      "placeholder",
      "note",
      "note_type",
      "target",
      "response",
      "save_response_into",
      "depends_on",
      "slider_range",
      "output_variable_name",
      "weight",
      "extra_output_variable",
      "type",
    ];
  };

  Question.labels = function () {
    return [
      "ID",
      "Quiz ID",
      "Question",
      "Question arguments",
      "Order",
      "Image width",
      "Image height",
      "Placeholder",
      "Note",
      "Note type",
      "Target",
      "Response",
      "Save response",
      "Depends on question",
      "Slider range",
      "Output variable",
      "weight",
      "Extra output variables",
      "Type",
    ];
  };

  Question.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["quiz_id", "Quiz ID", "required"],
      ["question", "Question", "required"],
      ["question_arguments", "Question arguments", ""],
      ["order", "Order", "required"],
      ["image_width", "Image width", "required"],
      ["image_height", "Image height", "required"],
      ["placeholder", "Placeholder", ""],
      ["note", "Note", ""],
      ["note_type", "Note type", ""],
      ["target", "Target", ""],
      ["response", "Response", ""],
      ["save_response_into", "Save response", ""],
      ["depends_on", "Depends on question", ""],
      ["slider_range", "Slider range", ""],
      ["output_variable_name", "Output variable", "required"],
      ["weight", "weight", "required"],
      ["extra_output_variable", "Extra output variables", ""],
      ["type", "Type", "required"],
    ];
  };

  Question.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["quiz_id", "Quiz ID", "required"],
      ["question", "Question", "required"],
      ["question_arguments", "Question arguments", ""],
      ["order", "Order", "required"],
      ["image_width", "Image width", "required"],
      ["image_height", "Image height", "required"],
      ["placeholder", "Placeholder", ""],
      ["note", "Note", ""],
      ["note_type", "Note type", ""],
      ["target", "Target", ""],
      ["response", "Response", ""],
      ["save_response_into", "Save response", ""],
      ["depends_on", "Depends on question", ""],
      ["slider_range", "Slider range", ""],
      ["output_variable_name", "Output variable", "required"],
      ["weight", "weight", "required"],
      ["extra_output_variable", "Extra output variables", ""],
      ["type", "Type", "required"],
    ];
  };

  Question.get_quiz_paginated = function (db, where = {}, ...rest) {
    return Question.getPaginated(...rest, [
      {
        model: db.quiz,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "quiz",
      },
    ]);
  };

  Question.get_answer_paginated = function (db, where = {}, ...rest) {
    return Question.getPaginated(...rest, [
      {
        model: db.answer,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "answers",
      },
    ]);
  };

  Question.get_question_quiz = (id, db) => {
    return Question.findByPk(id, {
      include: [
        {
          model: db.quiz,
          required: false,
          as: "quiz",
        },
      ],
    });
  };
  Question.get_question_answer = (id, db) => {
    return Question.findByPk(id, {
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
  Question.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          "id",
          "quiz_id",
          "question",
          "question_arguments",
          "order",
          "image_width",
          "image_height",
          "placeholder",
          "note",
          "note_type",
          "target",
          "response",
          "save_response_into",
          "depends_on",
          "slider_range",
          "output_variable_name",
          "weight",
          "extra_output_variable",
          "type",
          "created_at",
          "updated_at",
        ],
        Object.keys(fields)
      );
    } else return [];
  };

  return Question;
};
