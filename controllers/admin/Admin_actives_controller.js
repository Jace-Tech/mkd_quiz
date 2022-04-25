"use strict";
const axios = require("axios");

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

app.get("/admin/actives/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/actives_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.active, "Actives", session.success, session.error, "/admin/actives");

    viewModel._column = ["ID", "Name", "Handle", "Description", "Variables scores", "Action"];
    viewModel._readable_column = ["ID", "Name", "Handle", "Description", "Variables scores"];

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

    const count = await db.active._count(where, []);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/actives/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.active.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);

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

    return res.render("admin/Actives", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Actives", viewModel);
  }
});

app.get("/admin/actives-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const activesAdminAddViewModel = require("../../view_models/actives_admin_add_view_model");

  const viewModel = new activesAdminAddViewModel(db.active, "Add active", "", "", "/admin/actives");
  viewModel.output_variables = await db.output_variable.getAll();
  res.render("admin/Add_Actives", viewModel);
});

app.post("/admin/actives-add", SessionService.verifySessionMiddleware(role, "admin"), ValidationService.validateInput({ name: "required", handle: "required" }), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const activesAdminAddViewModel = require("../../view_models/actives_admin_add_view_model");

  const viewModel = new activesAdminAddViewModel(db.active, "Add active", "", "", "/admin/actives");
  viewModel.output_variables = await db.output_variable.getAll();

  // TODO use separate controller for image upload
  //  {{{upload_field_setter}}}

  const { name, description, handle, ...rest } = req.body;

  viewModel.form_fields = {
    ...viewModel.form_fields,
    name,
    handle,
    description,
  };

  try {
    if (req.validationError) {
      viewModel.error = req.validationError;
      return res.render("admin/Add_Actives", viewModel);
    }

    viewModel.session = req.session;

    const data = await db.active.insert({ name, description, handle, variables_scores: JSON.stringify(rest) });

    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Add_Actives", viewModel);
    }

    req.flash("success", "Active created successfully");
    return res.redirect("/admin/actives/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Add_Actives", viewModel);
  }
});

app.get("/admin/actives-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const activesAdminEditViewModel = require("../../view_models/actives_admin_edit_view_model");

  const viewModel = new activesAdminEditViewModel(db.active, "Edit active", "", "", "/admin/actives");
  viewModel.output_variables = await db.output_variable.getAll();

  try {
    const exists = await db.active.getByPK(id);

    if (!exists) {
      req.flash("error", "Active not found");
      return res.redirect("/admin/actives/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      viewModel.form_fields[field] = values[field] || "";
    });
    if (exists.variables_scores) {
      const currentOutputVariablesScores = JSON.parse(exists.variables_scores);
      Object.keys(currentOutputVariablesScores).forEach((varScore) => {
        viewModel.form_fields[varScore] = currentOutputVariablesScores[varScore];
      });
    }
    return res.render("admin/Edit_Actives", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Actives", viewModel);
  }
});

app.post("/admin/actives-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), ValidationService.validateInput({ name: "required", handle: "required" }), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const activesAdminEditViewModel = require("../../view_models/actives_admin_edit_view_model");

  const viewModel = new activesAdminEditViewModel(db.active, "Edit active", "", "", "/admin/actives");
  viewModel.form_fields = { variables_scores: "", name: "", id: "" };
  viewModel.output_variables = await db.output_variable.getAll();
  const { name, description, handle, ...rest } = req.body;

  viewModel.form_fields = {
    ...viewModel.form_fields,
    name,
    description,
    handle,
  };

  delete viewModel.form_fields.id;

  try {
    if (req.validationError) {
      viewModel.error = req.validationError;
      return res.render("admin/Edit_Actives", viewModel);
    }

    const resourceExists = await db.active.getByPK(id);
    if (!resourceExists) {
      req.flash("error", "Active not found");
      return res.redirect("/admin/actives/0");
    }

    viewModel.session = req.session;

    let data = await db.active.edit({ name, description, handle, variables_scores: JSON.stringify(rest) }, id);
    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Edit_Actives", viewModel);
    }

    req.flash("success", "Active edited successfully");

    return res.redirect("/admin/actives/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Actives", viewModel);
  }
});

app.get("/admin/resync/actives", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    var config = {
      method: "get",
      url: `https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}@${process.env.SHOPIFY_SITE}/admin/api/2021-10/products.json`,
      headers: {},
    };
    const data = await axios(config).then((response) => response.data);
    console.log(data.products);
    for (const product of data.products) {
      if (product.tags == "Personalized Cream" && product.title !== "Blank") {
        const activeExists = await db.active.getByFields({ name: product.title });
        if (activeExists) {
          await db.active.edit(
            {
              handle: `https://localhost:3001/products/${product.handle}`,
            },
            activeExists.id
          );
        } else {
          await db.active.insert({
            name: product.title,
            handle: `https://localhost:3001/products/${product.handle}`,
          });
        }
      }
    }

    req.flash("success", "Actives resynced successfully");
    return res.redirect("/admin/actives/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    return res.redirect("/admin/actives/0");
  }
});

app.get(
  "/admin/actives-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const activesAdminDetailViewModel = require("../../view_models/actives_admin_detail_view_model");

      var viewModel = new activesAdminDetailViewModel(db.active, "Active details", "", "", "/admin/actives");

      const data = await db.active.getByPK(id);

      if (!data) {
        viewModel.error = "Active not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", handle: "N/A", description: "N/A" };
      } else {
        viewModel.detail_fields = { ...viewModel.detail_fields, id: data["id"] || "N/A", name: data["name"] || "N/A", handle: data["handle"] || "N/A", description: data["description"] || "N/A" };
      }

      res.render("admin/View_Actives", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", handle: "N/A", description: "N/A" };
      res.render("admin/View_Actives", viewModel);
    }
  }
);

app.get("/admin/actives-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const activesAdminDeleteViewModel = require("../../view_models/actives_admin_delete_view_model");

  const viewModel = new activesAdminDeleteViewModel(db.active);

  try {
    const exists = await db.active.getByPK(id);

    if (!exists) {
      req.flash("error", "Active not found");
      return res.redirect("/admin/actives/0");
    }

    viewModel.session = req.session;

    await db.active.realDelete(id);
    await db.answer.destroy({
      where: {
        answer: exists.name,
      },
    });
    req.flash("success", "Active was deleted successfully");

    return res.redirect("/admin/actives/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/actives/0");
  }
});

// APIS
app.get("/api/v1/actives", async function (req, res, next) {
  try {
    const actives = await db.active.findAll();

    const response = { actives: actives };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});
module.exports = app;
