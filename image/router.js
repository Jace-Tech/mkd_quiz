'use strict';

const { nanoid} = require('nanoid');

const SessionService = require('../../services/SessionService');
const uploader = require('../../tools/file/uploader');
const db = require('../../models');

module.exports = {
  initializeApi: function (app) {
    app.post(
  "/api/replace-this",
  SessionService.verifySessionMiddleware(role),
  async function (req, res, next) {
    try {
      const imageUploadModel = require("../view_models/image_upload_local.js")

      const viewModel = imageUploadModel(db.image)

      
      const url = await viewModel.upload_resource(req, rest);
      await viewModel.create_resource({ url });

        return res.status(201).json({success:true, message:"xyzimage_uploaded_successfully"});
    } catch (error) {
      return res.status(500).json({success:false, message:"xyzsomething_went_wrong"})
    }
  },
);
    
    app.post(
  "/api/replace-this",
  SessionService.verifySessionMiddleware(role),
  async function (req, res, next) {
    try {
      const fileUploadModel = require("../view_models/file_upload_local.js")

      const viewModel = fileUploadModel(db.image)

      
      const url = await viewModel.upload_resource(req, rest);
      await viewModel.create_resource({ url });

        return res.status(201).json({success:true, message:"xyzimage_uploaded_successfully"});
    } catch (error) {
      return res.status(500).json({success:false, message:"xyzsomething_went_wrong"})
    }
  },
);

    return app;
  },
};
