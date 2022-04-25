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

app.get("/admin/profile-sections/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/result_profile_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.result_profile, "Profile sections", session.success, session.error, "/admin/profile-sections");

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
    viewModel.set_section_title(req.query.section_title ? req.query.section_title : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      section_title: viewModel.get_section_title(),
    });

    const count = await db.result_profile._count(where, []);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/profile-sections/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.result_profile.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);

    for (const item of list) {
      if (item.output_variable_list) {
        const parsedList = JSON.parse(item.output_variable_list);
        let actualList = await db.output_variable.findAll({
          where: {
            id: parsedList,
          },
        });
        actualList = actualList.map((ov) => ov.name);
        item.output_variable_list = actualList;
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

    return res.render("admin/Result_profile", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Result_profile", viewModel);
  }
});

app.get("/admin/profile-sections-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const resultProfileAdminAddViewModel = require("../../view_models/result_profile_admin_add_view_model");

  const viewModel = new resultProfileAdminAddViewModel(db.result_profile, "Add result profile", "", "", "/admin/profile-sections");
  viewModel.output_variables = await db.output_variable.getAll();
  res.render("admin/Add_Result_profile", viewModel);
});

app.post("/admin/profile-sections-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const resultProfileAdminAddViewModel = require("../../view_models/result_profile_admin_add_view_model");

  const viewModel = new resultProfileAdminAddViewModel(db.result_profile, "Add result profile", "", "", "/admin/profile-sections");
  viewModel.output_variables = await db.output_variable.getAll();
  // TODO use separate controller for image upload
  //  {{{upload_field_setter}}}

  const { section_title, output_variable_list = [] } = req.body;

  viewModel.form_fields = {
    ...viewModel.form_fields,
    section_title,
  };

  try {
    if (req.validationError) {
      viewModel.error = req.validationError;
      return res.render("admin/Add_Result_profile", viewModel);
    }

    viewModel.session = req.session;
    output_variable_list;
    const data = await db.result_profile.insert({
      section_title,
      output_variable_list: !Array.isArray(output_variable_list) ? JSON.stringify([output_variable_list]) : JSON.stringify(output_variable_list),
    });

    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Add_Result_profile", viewModel);
    }

    req.flash("success", "Result profile created successfully");
    return res.redirect("/admin/profile-sections/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Add_Result_profile", viewModel);
  }
});

app.get("/admin/profile-sections-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const resultProfileAdminEditViewModel = require("../../view_models/result_profile_admin_edit_view_model");

  const viewModel = new resultProfileAdminEditViewModel(db.result_profile, "Edit result profile", "", "", "/admin/profile-sections");

  try {
    const exists = await db.result_profile.getByPK(id);

    if (!exists) {
      req.flash("error", "Result profile not found");
      return res.redirect("/admin/profile-sections/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      viewModel.form_fields[field] = values[field] || "";
    });
    if (viewModel.form_fields["output_variable_list"]) {
      const parsedList = JSON.parse(viewModel.form_fields["output_variable_list"]);
      let actualList = await db.output_variable.findAll({
        where: {
          id: parsedList,
        },
      });
      actualList = actualList.map((ov) => ov.name);
      viewModel.form_fields["output_variable_list"] = actualList;
    }
    viewModel.output_variables = await db.output_variable.getAll();
    return res.render("admin/Edit_Result_profile", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Result_profile", viewModel);
  }
});

app.post("/admin/profile-sections-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const resultProfileAdminEditViewModel = require("../../view_models/result_profile_admin_edit_view_model");

  const viewModel = new resultProfileAdminEditViewModel(db.result_profile, "Edit result profile", "", "", "/admin/profile-sections");

  let { section_title, output_variable_list = [] } = req.body;

  viewModel.form_fields = {
    ...viewModel.form_fields,
    section_title,
    output_variable_list,
  };

  delete viewModel.form_fields.id;

  try {
    if (req.validationError) {
      viewModel.error = req.validationError;
      return res.render("admin/Edit_Result_profile", viewModel);
    }

    const resourceExists = await db.result_profile.getByPK(id);
    if (!resourceExists) {
      req.flash("error", "Result profile not found");
      return res.redirect("/admin/profile-sections/0");
    }

    viewModel.session = req.session;
    let data = await db.result_profile.edit(
      { section_title, output_variable_list: !Array.isArray(output_variable_list) ? JSON.stringify([output_variable_list]) : JSON.stringify(output_variable_list) },
      id
    );
    if (!data) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Edit_Result_profile", viewModel);
    }

    req.flash("success", "Result profile edited successfully");

    return res.redirect("/admin/profile-sections/0");
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Result_profile", viewModel);
  }
});

app.get(
  "/admin/profile-sections-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const resultProfileAdminDetailViewModel = require("../../view_models/result_profile_admin_detail_view_model");

      var viewModel = new resultProfileAdminDetailViewModel(db.result_profile, "Result profile details", "", "", "/admin/profile-sections");

      const data = await db.result_profile.getByPK(id);

      if (data["output_variable_list"]) {
        const parsedList = JSON.parse(data["output_variable_list"]);
        let actualList = await db.output_variable.findAll({
          where: {
            id: parsedList,
          },
        });
        actualList = actualList.map((ov) => ov.name);
        data["output_variable_list"] = actualList;
      }
      if (!data) {
        viewModel.error = "Result profile not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", section_title: "N/A", output_variable_list: "N/A" };
      } else {
        viewModel.detail_fields = { ...viewModel.detail_fields, id: data["id"] || "N/A", section_title: data["section_title"] || "N/A", output_variable_list: data["output_variable_list"] || "N/A" };
      }

      res.render("admin/View_Result_profile", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", section_title: "N/A", output_variable_list: "N/A" };
      res.render("admin/View_Result_profile", viewModel);
    }
  }
);

app.get("/admin/profile-sections-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const resultProfileAdminDeleteViewModel = require("../../view_models/result_profile_admin_delete_view_model");

  const viewModel = new resultProfileAdminDeleteViewModel(db.result_profile);

  try {
    const exists = await db.result_profile.getByPK(id);

    if (!exists) {
      req.flash("error", "Result profile not found");
      return res.redirect("/admin/profile-sections/0");
    }

    viewModel.session = req.session;

    await db.result_profile.realDelete(id);

    req.flash("success", "Result profile was deleted successfully");

    return res.redirect("/admin/profile-sections/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/profile-sections/0");
  }
});

// APIS

app.get("/admin/api/profile-sections", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  try {
    const user_id = req.user_id;
    const session = req.session;
    let listViewModel = require("../../view_models/result_profile_admin_list_paginate_view_model");
    let viewModel = new listViewModel(db.result_profile, "Profile sections", session.success, session.error, "/admin/profile-sections");
    const direction = req.query.direction ? req.query.direction : "ASC";
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
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

    viewModel.set_id(req.query.id ? req.query.id : "");
    viewModel.set_section_title(req.query.section_title ? req.query.section_title : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      section_title: viewModel.get_section_title(),
    });

    let include = [];

    const { rows: allItems, count } = await db.result_profile.findAndCountAll({
      where: where,
      limit: limit == 0 ? null : limit,
      offset: offset,
      include: include,
      distinct: true,
    });

    const response = {
      items: allItems,
      page,
      nextPage: count > offset + limit ? page + 1 : false,
      retrievedCount: allItems.length,
      fullCount: count,
    };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

app.post("/admin/api/profile-sections-add", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  const resultProfileAdminAddViewModel = require("../../view_models/result_profile_admin_add_view_model");

  const viewModel = new resultProfileAdminAddViewModel(db.result_profile);

  const { section_title, output_variable_list } = req.body;
  try {
    if (req.validationError) {
      return res.status(500).json({ success: false, message: req.validationError });
    }

    const data = await db.result_profile.insert({ section_title, output_variable_list });

    if (!data) {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }

    return res.status(201).json({ success: true, message: "Result profile created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

app.put("/admin/api/profile-sections-edit/:id", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  let id = req.params.id;

  const resultProfileAdminEditViewModel = require("../../view_models/result_profile_admin_edit_view_model");

  const viewModel = new resultProfileAdminEditViewModel(db.result_profile);

  const { section_title, output_variable_list } = req.body;

  try {
    if (req.validationError) {
      return res.status(500).json({ success: false, message: req.validationError });
    }

    const resourceExists = await db.result_profile.getByPK(id);
    if (!resourceExists) {
      return res.status(404).json({ success: false, message: "Result profile not found" });
    }

    const data = await db.result_profile.edit({ section_title, output_variable_list }, id);

    if (!data) {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }

    return res.json({ success: true, message: "Result profile edited successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

app.get("/admin/api/profile-sections-view/:id", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  let id = req.params.id;

  const resultProfileAdminDetailViewModel = require("../../view_models/result_profile_admin_detail_view_model");

  const viewModel = new resultProfileAdminDetailViewModel(db.result_profile);

  try {
    const data = await db.result_profile.getByPK(id);

    if (!data) {
      return res.status(404).json({ message: "Result profile not found", data: null });
    } else {
      const fields = { ...viewModel.detail_fields, id: data["id"] || "", section_title: data["section_title"] || "", output_variable_list: data["output_variable_list"] || "" };
      return res.status(200).json({ data: fields });
    }
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong", data: null });
  }
});

app.delete("/admin/api/profile-sections-delete/:id", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  let id = req.params.id;

  const resultProfileAdminDeleteViewModel = require("../../view_models/result_profile_admin_delete_view_model");

  const viewModel = new resultProfileAdminDeleteViewModel(db.result_profile);

  try {
    const exists = await db.result_profile.getByPK(id);

    if (!exists) {
      return res.status(404).json({ success: false, message: "Result profile not found" });
    }

    await db.result_profile.realDelete(id);

    return res.status(200).json({ success: true, message: "Result profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

module.exports = app;
