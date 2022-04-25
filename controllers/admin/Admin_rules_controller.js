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

app.get("/admin/rules/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/rules_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.rule, "Rules", session.success, session.error, "/admin/rules");

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
    viewModel.set_operator(req.query.operator ? req.query.operator : "");
    viewModel.set_action(req.query.action ? req.query.action : "");
    viewModel.set_output_variable_name(req.query.output_variable_name ? req.query.output_variable_name : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      operator: viewModel.get_operator(),
      action: viewModel.get_action(),
      output_variable_name: viewModel.get_output_variable_name(),
    });

    const count = await db.rule._count(where, []);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/rules/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.rule.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);

    viewModel.set_list(list);

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

    return res.render("admin/Rules", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Rules", viewModel);
  }
});

app.get("/admin/rules-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const rulesAdminAddViewModel = require("../../view_models/rules_admin_add_view_model");

  const viewModel = new rulesAdminAddViewModel(db.rule, "Add rule", "", "", "/admin/rules");
  viewModel.outputVariables = await db.output_variable.getAll();
  viewModel.actives = await db.active.getAll();
  res.render("admin/Add_Rules", viewModel);
});

app.post(
  "/admin/rules-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { output_variable_name: "required", actives: "required", operator: "required", compare_value: "required", action: "required" },
    {
      "output_variable_name.required": "OutputVariableName is required",
      "actives.required": "Actives is required",
      "operator.required": "Operator is required",
      "compare_value.required": "CompareValue is required",
      "action.required": "Action is required",
    }
  ),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const rulesAdminAddViewModel = require("../../view_models/rules_admin_add_view_model");

    const viewModel = new rulesAdminAddViewModel(db.rule, "Add rule", "", "", "/admin/rules");
    viewModel.outputVariables = await db.output_variable.getAll();
    viewModel.actives = await db.active.getAll();

    // TODO use separate controller for image upload
    //  {{{upload_field_setter}}}

    let { output_variable_name, actives, operator, compare_value, min, max, action } = req.body;
    if (!Array.isArray(actives)) {
      actives = [actives];
    }
    viewModel.form_fields = {
      ...viewModel.form_fields,
      output_variable_name,
      actives,
      operator,
      compare_value,
      min,
      max,
      action,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Add_Rules", viewModel);
      }

      viewModel.session = req.session;

      const data = await db.rule.insert({ output_variable_name, actives: JSON.stringify(actives), operator, compare_value, min, max, action });

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Rules", viewModel);
      }

      req.flash("success", "Rule created successfully");
      return res.redirect("/admin/rules/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Add_Rules", viewModel);
    }
  }
);

app.get("/admin/rules-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const rulesAdminEditViewModel = require("../../view_models/rules_admin_edit_view_model");

  const viewModel = new rulesAdminEditViewModel(db.rule, "Edit rule", "", "", "/admin/rules");

  try {
    const exists = await db.rule.getByPK(id);

    if (!exists) {
      req.flash("error", "Rule not found");
      return res.redirect("/admin/rules/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      viewModel.form_fields[field] = values[field] || "";
    });

    viewModel.outputVariables = await db.output_variable.getAll();
    viewModel.actives = await db.active.getAll();
    return res.render("admin/Edit_Rules", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Rules", viewModel);
  }
});

app.post(
  "/admin/rules-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { output_variable_name: "required", actives: "required", operator: "required", compare_value: "required", action: "required" },
    {
      "output_variable_name.required": "OutputVariableName is required",
      "actives.required": "Actives is required",
      "operator.required": "Operator is required",
      "compare_value.required": "CompareValue is required",
      "action.required": "Action is required",
    }
  ),
  async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const rulesAdminEditViewModel = require("../../view_models/rules_admin_edit_view_model");

    const viewModel = new rulesAdminEditViewModel(db.rule, "Edit rule", "", "", "/admin/rules");

    viewModel.outputVariables = await db.output_variable.getAll();
    viewModel.actives = await db.active.getAll();
    let { output_variable_name, actives, operator, compare_value, min, max, action } = req.body;
    if (!Array.isArray(actives)) {
      actives = [actives];
    }
    viewModel.form_fields = {
      ...viewModel.form_fields,
      output_variable_name,
      actives,
      operator,
      compare_value,
      min,
      max,
      action,
    };

    delete viewModel.form_fields.id;

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Edit_Rules", viewModel);
      }

      const resourceExists = await db.rule.getByPK(id);
      if (!resourceExists) {
        req.flash("error", "Rule not found");
        return res.redirect("/admin/rules/0");
      }

      viewModel.session = req.session;

      let data = await db.rule.edit({ output_variable_name, actives: JSON.stringify(actives), operator, compare_value, min, max, action }, id);
      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Edit_Rules", viewModel);
      }

      req.flash("success", "Rule edited successfully");

      return res.redirect("/admin/rules/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Edit_Rules", viewModel);
    }
  }
);

app.get(
  "/admin/rules-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const rulesAdminDetailViewModel = require("../../view_models/rules_admin_detail_view_model");

      var viewModel = new rulesAdminDetailViewModel(db.rule, "Rule details", "", "", "/admin/rules");

      const data = await db.rule.getByPK(id);
      data.operator = db.rule.operator_mapping()[data.operator];
      data.action = db.rule.action_mapping()[data.action];

      if (!data) {
        viewModel.error = "Rule not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", output_variable_name: "N/A", actives: "N/A", operator: "N/A", compare_value: "N/A", min: "N/A", max: "N/A", action: "N/A" };
      } else {
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: data["id"] || "N/A",
          output_variable_name: data["output_variable_name"] || "N/A",
          actives: data["actives"] || "N/A",
          operator: data["operator"] || "N/A",
          compare_value: data["compare_value"] || "N/A",
          min: data["min"] || "N/A",
          max: data["max"] || "N/A",
          action: data["action"] || "N/A",
        };
      }

      res.render("admin/View_Rules", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", output_variable_name: "N/A", actives: "N/A", operator: "N/A", compare_value: "N/A", min: "N/A", max: "N/A", action: "N/A" };
      res.render("admin/View_Rules", viewModel);
    }
  }
);

app.get("/admin/rules-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const rulesAdminDeleteViewModel = require("../../view_models/rules_admin_delete_view_model");

  const viewModel = new rulesAdminDeleteViewModel(db.rule);

  try {
    const exists = await db.rule.getByPK(id);

    if (!exists) {
      req.flash("error", "Rule not found");
      return res.redirect("/admin/rules/0");
    }

    viewModel.session = req.session;

    await db.rule.realDelete(id);

    req.flash("success", "Rule was deleted successfully");

    return res.redirect("/admin/rules/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/rules/0");
  }
});

// APIS

module.exports = app;
