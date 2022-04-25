/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * order Model
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
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      webhook_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      shopify_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      event: DataTypes.TEXT,
      customer_shopify_id: DataTypes.STRING,
      customer: DataTypes.TEXT,
      answers: DataTypes.TEXT,
      profile: DataTypes.TEXT,
      actives: DataTypes.TEXT,
      items: DataTypes.TEXT,
      financial_status: DataTypes.STRING,
      fulfillment_status: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "order",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Order);

  Order._preCreateProcessing = function (data) {
    return data;
  };
  Order._postCreateProcessing = function (data) {
    return data;
  };
  Order._customCountingConditions = function (data) {
    return data;
  };

  Order._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Order.allowFields();
    allowedFields.push(Order._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Order.timeDefaultMapping = function () {
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

  Order.associate = function (models) {};

  Order.allowFields = function () {
    return ["id", "webhook_id", "shopify_id", "event", "profile", "actives", "customer_shopify_id", "customer", "answers", "items", "financial_status", "fulfillment_status"];
  };

  Order.labels = function () {
    return ["ID", "Webhook Id", "Order shopify id", "Event", "Profile", "Actives", "Customer", "Customer", "Answers", "Items", "Financial status", "Fulfillment status"];
  };

  Order.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["shopify_id", "Order shopify id", ""],
      ["event", "Event", ""],
      ["customer_shopify_id", "Customer", ""],
      ["customer", "Customer", ""],
      ["answers", "Answers", ""],
      ["items", "Items", ""],
      ["financial_status", "Financial status", ""],
      ["fulfillment_status", "Fulfillment status", ""],
    ];
  };

  Order.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["shopify_id", "Order shopify id", ""],
      ["event", "Event", ""],
      ["customer_shopify_id", "Customer", ""],
      ["customer", "Customer", ""],
      ["answers", "Answers", ""],
      ["items", "Items", ""],
      ["financial_status", "Financial status", ""],
      ["fulfillment_status", "Fulfillment status", ""],
    ];
  };

  // ex
  Order.intersection = function (fields) {
    if (fields) {
      return intersection(
        ["id", "webhook_id", "shopify_id", "event", "customer_shopify_id", "profile", "actives", "customer", "answers", "items", "financial_status", "fulfillment_status", "created_at", "updated_at"],
        Object.keys(fields)
      );
    } else return [];
  };

  return Order;
};
