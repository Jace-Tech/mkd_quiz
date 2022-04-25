"use strict";

const app = require("express").Router();
// const Sequelize = require("sequelize");
// const logger = require("../../services/LoggingService");
// let pagination = require("../../services/PaginationService");
// let JwtService = require("../../services/JwtService");
let SessionService = require("../../services/SessionService");
const ValidationService = require("../../services/ValidationService");
// const PermissionService = require("../../services/PermissionService");
// const UploadService = require("../../services/UploadService");
// const AuthService = require("../../services/AuthService");
const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get("/admin/output-variables/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/output_variables_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.output_variable, "Output variables", session.success, session.error, "/admin/output-variables");

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
    viewModel.set_name(req.query.name ? req.query.name : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      name: viewModel.get_name(),
    });

    const count = await db.output_variable._count(where, []);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/output-variables/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.output_variable.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);
    for (const item of list) {
      if (item.active_list) {
        const actives = await db.active.findAll({
          where: {
            id: JSON.parse(item.active_list),
          },
        });
        item.active_list = actives.map((active) => {
          return { name: active.name, id: active.id };
        });
      }
    }
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

    return res.render("admin/Output_variables", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Output_variables", viewModel);
  }
});

app.get("/admin/output-variables-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const outputVariablesAdminAddViewModel = require("../../view_models/output_variables_admin_add_view_model");

  const viewModel = new outputVariablesAdminAddViewModel(db.output_variable, "Add output variable", "", "", "/admin/output-variables");
  viewModel.actives = await db.active.getAll();
  res.render("admin/Add_Output_variables", viewModel);
});

app.post(
  "/admin/output-variables-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ name: "required", active_list: "required" }, { "name.required": "Name is required", "active_list.required": "ActiveList is required" }),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const outputVariablesAdminAddViewModel = require("../../view_models/output_variables_admin_add_view_model");

    const viewModel = new outputVariablesAdminAddViewModel(db.output_variable, "Add output variable", "", "", "/admin/output-variables");
    viewModel.actives = await db.active.getAll();

    const { name, active_list, ranges, responses } = req.body;
    let ranges_response = [],
      i = 0;
    if (Array.isArray(ranges) && Array.isArray(responses)) {
      for (const range of ranges) {
        let tempObj = {};
        tempObj[range] = responses[i];
        ranges_response.push(tempObj);
        i++;
      }
    } else {
      ranges_response.push({
        [ranges]: responses,
      });
    }
    viewModel.form_fields = {
      ...viewModel.form_fields,
      name,
      active_list,
      ranges_response,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Add_Output_variables", viewModel);
      }

      viewModel.session = req.session;

      const data = await db.output_variable.insert({ name, active_list: JSON.stringify(active_list), ranges_response: JSON.stringify(ranges_response) });

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Output_variables", viewModel);
      }

      req.flash("success", "Output variable created successfully");
      return res.redirect("/admin/output-variables/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Add_Output_variables", viewModel);
    }
  }
);

app.get("/admin/output-variables-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const outputVariablesAdminEditViewModel = require("../../view_models/output_variables_admin_edit_view_model");

  const viewModel = new outputVariablesAdminEditViewModel(db.output_variable, "Edit output variable", "", "", "/admin/output-variables");

  try {
    const exists = await db.output_variable.getByPK(id);

    if (!exists) {
      req.flash("error", "Output variable not found");
      return res.redirect("/admin/output-variables/0");
    }

    viewModel.outputVariable = exists;
    viewModel.actives = await db.active.getAll();
    return res.render("admin/Edit_Output_variables", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Output_variables", viewModel);
  }
});

app.post(
  "/admin/output-variables-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ name: "required" }, { "name.required": "Name is required" }),
  async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const outputVariablesAdminEditViewModel = require("../../view_models/output_variables_admin_edit_view_model");

    const viewModel = new outputVariablesAdminEditViewModel(db.output_variable, "Edit output variable", "", "", "/admin/output-variables");

    const { name, active_list, ranges, responses } = req.body;
    let ranges_response = [],
      i = 0;

    if (Array.isArray(ranges) && Array.isArray(responses)) {
      for (const range of ranges) {
        let tempObj = {};
        tempObj[range] = responses[i];
        ranges_response.push(tempObj);
        i++;
      }
    } else {
      ranges_response.push({
        [ranges]: responses,
      });
    }
    ranges_response = JSON.stringify(ranges_response);
    viewModel.form_fields = {
      ...viewModel.form_fields,
      name,
      active_list,
      ranges_response,
    };
    delete viewModel.form_fields.id;

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Edit_Output_variables", viewModel);
      }

      const resourceExists = await db.output_variable.getByPK(id);
      if (!resourceExists) {
        req.flash("error", "Output variable not found");
        return res.redirect("/admin/output-variables/0");
      }

      viewModel.outputVariable = resourceExists;
      viewModel.session = req.session;

      let data = await db.output_variable.edit(
        {
          name,
          active_list: active_list ? JSON.stringify(active_list) : null,
          // active_list,
          ranges_response,
        },
        id
      );
      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Edit_Output_variables", viewModel);
      }

      req.flash("success", "Output variable edited successfully");

      return res.redirect("/admin/output-variables/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Edit_Output_variables", viewModel);
    }
  }
);

app.get(
  "/admin/output-variables-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const outputVariablesAdminDetailViewModel = require("../../view_models/output_variables_admin_detail_view_model");

      var viewModel = new outputVariablesAdminDetailViewModel(db.output_variable, "Output variable details", "", "", "/admin/output-variables");

      const data = await db.output_variable.getByPK(id);

      if (data.active_list) {
        const actives = await db.active.findAll({
          where: {
            id: JSON.parse(data.active_list),
          },
        });
        data.active_list = actives.map((active) => {
          return { name: active.name, id: active.id };
        });
      }

      if (!data) {
        viewModel.error = "Output variable not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", active_list: "N/A", ranges_response: "N/A" };
      } else {
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: data["id"] || "N/A",
          name: data["name"] || "N/A",
          active_list: data["active_list"] || "N/A",
          ranges_response: data["ranges_response"] || "N/A",
        };
      }

      res.render("admin/View_Output_variables", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", active_list: "N/A", ranges_response: "N/A" };
      res.render("admin/View_Output_variables", viewModel);
    }
  }
);

app.get("/admin/output-variables-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const outputVariablesAdminDeleteViewModel = require("../../view_models/output_variables_admin_delete_view_model");

  const viewModel = new outputVariablesAdminDeleteViewModel(db.output_variable);

  try {
    const exists = await db.output_variable.getByPK(id);

    if (!exists) {
      req.flash("error", "Output variable not found");
      return res.redirect("/admin/output-variables/0");
    }

    viewModel.session = req.session;

    await db.output_variable.realDelete(id);

    req.flash("success", "Output variable was deleted successfully");

    return res.redirect("/admin/output-variables/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/output-variables/0");
  }
});

// APIS
app.get("/api/v1/output-variables", async function (req, res, next) {
  try {
    const outputVariables = await db.output_variable.findAll();

    const response = { output_variables: outputVariables };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});
module.exports = app;
