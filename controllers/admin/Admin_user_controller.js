"use strict";

const app = require("express").Router();
const Sequelize = require("sequelize");
const logger = require("../../services/LoggingService");
let pagination = require("../../services/PaginationService");
let SessionService = require("../../services/SessionService");
let JwtService = require("../../services/JwtService");
const ValidationService = require("../../services/ValidationService");
const PermissionService = require("../../services/PermissionService");
const UploadService = require("../../services/UploadService");
const AuthService = require("../../services/AuthService");
const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get("/admin/users/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/users_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.user, "Users", session.success, session.error, "/admin/users");

    const format = req.query.format ? req.query.format : "view";
    const direction = req.query.direction ? req.query.direction : "ASC";
    const per_page = req.query.per_page ? req.query.per_page : 10;
    let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
    let orderAssociations = [];
    viewModel.set_order_by(order_by);
    let joins = order_by.includes(".") ? order_by.split(".") : [];
    order_by = order_by.includes(".") ? joins[joins.length - 1] : order_by;
    if (joins.length > 0) {
      for (let i = joins.length - 1; i > 0; i--) {
        orderAssociations.push(`${joins[i - 1]}`);
      }
    }
    // Check for flash messages
    const flashMessageSuccess = req.flash("success");
    if (flashMessageSuccess && flashMessageSuccess.length > 0) {
      viewModel.success = flashMessageSuccess[0];
    }
    const flashMessageError = req.flash("error");
    if (flashMessageError && flashMessageError.length > 0) {
      viewModel.error = flashMessageError[0];
    }

    viewModel.set_id(req.query.id ? req.query.id : "");
    viewModel.set_credential_email(req.query.credential_email ? req.query.credential_email : "");
    viewModel.set_first_name(req.query.first_name ? req.query.first_name : "");
    viewModel.set_last_name(req.query.last_name ? req.query.last_name : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      first_name: viewModel.get_first_name(),
      last_name: viewModel.get_last_name(),
    });

    let associatedWhere = helpers.filterEmptyFields({
      email: viewModel.get_credential_email(),
    });
    const isAssociationRequired = Object.keys(associatedWhere).length > 0 ? true : false;

    const count = await db.user._count(where, [{ model: db.credential, where: associatedWhere, required: isAssociationRequired, as: "credential" }]);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/users/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.user.get_credential_paginated(
      db,
      associatedWhere,
      viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(),
      viewModel.get_per_page(),
      where,
      order_by,
      direction,
      orderAssociations
    );

    viewModel.set_list(list);

    viewModel.credential = await db.credential;

    if (format == "csv") {
      const csv = viewModel.to_csv();
      return res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="export.csv"',
        })
        .send(csv);
    }

    // if (format != 'view') {
    //   res.json(viewModel.to_json());
    // } else {
    // }

    return res.render("admin/Users", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Users", viewModel);
  }
});

app.get("/admin/users-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const usersAdminAddViewModel = require("../../view_models/users_admin_add_view_model");

  const viewModel = new usersAdminAddViewModel(db.user, "Add user", "", "", "/admin/users");

  res.render("admin/Add_Users", viewModel);
});

app.post(
  "/admin/users-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { first_name: "required", last_name: "required", status: "required" },
    { "first_name.required": "FirstName is required", "last_name.required": "LastName is required", "status.required": "Status is required" }
  ),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const usersAdminAddViewModel = require("../../view_models/users_admin_add_view_model");

    const viewModel = new usersAdminAddViewModel(db.user, "Add user", "", "", "/admin/users");

    // TODO use separate controller for image upload
    //  {{{upload_field_setter}}}

    const { email, password, first_name, last_name, image, role_id, phone, status } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      email,
      password,
      first_name,
      last_name,
      image,
      role_id,
      phone,
      status,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Add_Users", viewModel);
      }

      viewModel.session = req.session;

      const { email, password = "", role_id, ...rest } = viewModel.form_fields;
      const data = await AuthService.register(email, password, role_id, rest);

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Users", viewModel);
      }

      await db.activity_log.insert({
        action: "ADD",
        name: "Admin_user_controller.js",
        portal: "admin",
        data: JSON.stringify({ email, password, first_name, last_name, image, role_id, phone, status }),
      });

      req.flash("success", "User created successfully");
      return res.redirect("/admin/users/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Add_Users", viewModel);
    }
  }
);

app.get("/admin/users-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const usersAdminEditViewModel = require("../../view_models/users_admin_edit_view_model");

  const viewModel = new usersAdminEditViewModel(db.user, "Edit user", "", "", "/admin/users");

  try {
    const exists = await db.user.get_user_credential(id, db);

    if (!exists) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      if (field === "credential.email") {
        viewModel.form_fields[field] = values["credential"]["email"];
        return;
      }
      if (field === "credential.password") {
        viewModel.form_fields[field] = values["credential"]["password"];
        return;
      }
      viewModel.form_fields[field] = values[field] || "";
    });
    viewModel.credential = db.credential;
    return res.render("admin/Edit_Users", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Users", viewModel);
  }
});

app.post("/admin/users-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const usersAdminEditViewModel = require("../../view_models/users_admin_edit_view_model");

  const viewModel = new usersAdminEditViewModel(db.user, "Edit user", "", "", "/admin/users");

  const { credential_email, credential_password, first_name, last_name, role_id, image, phone, status } = req.body;

  viewModel.form_fields = {
    ...viewModel.form_fields,
    "credential.email": credential_email,
    "credential.password": credential_password,
    first_name,
    last_name,
    role_id,
    image,
    phone,
    status,
  };

  delete viewModel.form_fields.id;

  try {
    if (req.validationError) {
      viewModel.error = req.validationError;
      return res.render("admin/Edit_Users", viewModel);
    }

    const resourceExists = await db.user.get_user_credential(id, db);
    if (!resourceExists) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users/0");
    }

    viewModel.session = req.session;

    let data = await db.user.edit({ first_name, last_name, role_id, image, phone, status }, id);
    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Edit_Users", viewModel);
    }

    if (resourceExists.credential) {
      data = await db.credential.edit(helpers.filterEmptyFields({ email: credential_email, password: credential_password }), resourceExists.credential.id);
      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Edit_Users", viewModel);
      }
    }

    await db.activity_log.insert({
      action: "EDIT",
      name: "Admin_user_controller.js",
      portal: "admin",
      data: JSON.stringify({ credential_email, credential_password, first_name, last_name, role_id, image, phone, status }),
    });

    req.flash("success", "User edited successfully");

    return res.redirect("/admin/users/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Users", viewModel);
  }
});

app.get(
  "/admin/users-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const usersAdminDetailViewModel = require("../../view_models/users_admin_detail_view_model");

      var viewModel = new usersAdminDetailViewModel(db.user, "User details", "", "", "/admin/users");

      const data = await db.user.get_user_credential(id, db);
      data.status = db.user.status_mapping()[data.status];
      data["credential.two_factor_authentication"] = db.credential.two_factor_authentication_mapping()[data.credential.two_factor_authentication];
      data["credential.type"] = db.credential.type_mapping()[data.credential.type];
      data["credential.status"] = db.credential.status_mapping()[data.credential.status];
      data["credential.verify"] = db.credential.verify_mapping()[data.credential.verify];

      if (!data) {
        viewModel.error = "User not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", "credential.email": "N/A", first_name: "N/A", last_name: "N/A", role_id: "N/A", status: "N/A" };
      } else {
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: data["id"] || "N/A",
          "credential.email": data["credential"]["email"] || "N/A",
          first_name: data["first_name"] || "N/A",
          last_name: data["last_name"] || "N/A",
          role_id: data["role_id"] || "N/A",
          status: data["status"] || "N/A",
        };
      }

      res.render("admin/View_Users", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", "credential.email": "N/A", first_name: "N/A", last_name: "N/A", role_id: "N/A", status: "N/A" };
      res.render("admin/View_Users", viewModel);
    }
  }
);

// APIS

module.exports = app;
