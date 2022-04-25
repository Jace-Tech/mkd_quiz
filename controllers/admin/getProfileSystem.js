"use strict";

const app = require("express").Router();
// const Sequelize = require('sequelize');
// const logger = require('../../services/LoggingService');
// let pagination = require('../../services/PaginationService');
// let SessionService = require('../../services/SessionService');
let JwtService = require("../../services/JwtService");
const ValidationService = require("../../services/ValidationService");
// const PermissionService = require('../../services/PermissionService');
// const UploadService = require('../../services/UploadService');
// const AuthService = require('../../services/AuthService');
const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get("/admin/api/profile-system", async function (req, res, next) {
  try {
    const { rows: allItems, count } = await db.profile_header.findAndCountAll({
      offset: offset,
      order: [["id", direction]],
      distinct: true,
    });

    const response = {
      items: allItems,
      count,
    };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});
module.exports = app;
