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

app.get("/admin/quizzes/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/quizzes_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.quiz, "Quizzes", session.success, session.error, "/admin/quizzes");

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

    let associatedWhere = helpers.filterEmptyFields({});
    const isAssociationRequired = Object.keys(associatedWhere).length > 0 ? true : false;

    const count = await db.quiz._count(where, [{ model: db.question, where: associatedWhere, required: isAssociationRequired, as: "questions" }]);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/quizzes/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.quiz.get_question_paginated(
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

    viewModel.question = await db.question;

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

    return res.render("admin/Quizzes", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Quizzes", viewModel);
  }
});

app.get("/admin/quizzes-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const quizzesAdminAddViewModel = require("../../view_models/quizzes_admin_add_view_model");

  const viewModel = new quizzesAdminAddViewModel(db.quiz, "Add quiz", "", "", "/admin/quizzes");

  res.render("admin/Add_Quizzes", viewModel);
});

app.post(
  "/admin/quizzes-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ name: "required" }, { "name.required": "Name is required" }),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const quizzesAdminAddViewModel = require("../../view_models/quizzes_admin_add_view_model");

    const viewModel = new quizzesAdminAddViewModel(db.quiz, "Add quiz", "", "", "/admin/quizzes");

    // TODO use separate controller for image upload
    //  {{{upload_field_setter}}}

    const { name, description } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      name,
      description,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Add_Quizzes", viewModel);
      }

      viewModel.session = req.session;

      const data = await db.quiz.insert({ name, description });

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Quizzes", viewModel);
      }

      await db.activity_log.insert({
        action: "ADD",
        name: "Admin_quiz_controller.js",
        portal: "admin",
        data: JSON.stringify({ name, description }),
      });

      req.flash("success", "Quiz created successfully");
      return res.redirect("/admin/quizzes/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Add_Quizzes", viewModel);
    }
  }
);

app.get("/admin/quizzes-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const quizzesAdminEditViewModel = require("../../view_models/quizzes_admin_edit_view_model");

  const viewModel = new quizzesAdminEditViewModel(db.quiz, "Edit quiz", "", "", "/admin/quizzes");

  try {
    const exists = await db.quiz.getByPK(id);

    if (!exists) {
      req.flash("error", "Quiz not found");
      return res.redirect("/admin/quizzes/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      viewModel.form_fields[field] = values[field] || "";
    });
    viewModel.question = db.question;
    return res.render("admin/Edit_Quizzes", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Quizzes", viewModel);
  }
});

app.post(
  "/admin/quizzes-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ name: "required" }, { "name.required": "Name is required" }),
  async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const quizzesAdminEditViewModel = require("../../view_models/quizzes_admin_edit_view_model");

    const viewModel = new quizzesAdminEditViewModel(db.quiz, "Edit quiz", "", "", "/admin/quizzes");

    const { name, description } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      name,
      description,
    };

    delete viewModel.form_fields.id;

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Edit_Quizzes", viewModel);
      }

      const resourceExists = await db.quiz.getByPK(id);
      if (!resourceExists) {
        req.flash("error", "Quiz not found");
        return res.redirect("/admin/quizzes/0");
      }

      viewModel.session = req.session;

      let data = await db.quiz.edit({ name, description }, id);
      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Edit_Quizzes", viewModel);
      }

      if (resourceExists.questions) {
        if (resourceExists.questions.length == 1) {
          resourceExists.questions.forEach(async (item) => {
            data = await db.question.edit(helpers.filterEmptyFields({}), item.id);
            if (!data) {
              viewModel.error = "Something went wrong";
              return res.render("admin/Edit_Quizzes", viewModel);
            }
          });
        } else {
          resourceExists.questions.forEach(async (item, index) => {
            data = await db.question.edit(helpers.filterEmptyFields({}), item.id);
            if (!data) {
              viewModel.error = "Something went wrong";
              return res.render("admin/Edit_Quizzes", viewModel);
            }
          });
        }
      }

      await db.activity_log.insert({
        action: "EDIT",
        name: "Admin_quiz_controller.js",
        portal: "admin",
        data: JSON.stringify({ name, description }),
      });

      req.flash("success", "Quiz edited successfully");

      return res.redirect("/admin/quizzes/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Edit_Quizzes", viewModel);
    }
  }
);

app.get(
  "/admin/quizzes-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const quizzesAdminDetailViewModel = require("../../view_models/quizzes_admin_detail_view_model");

      var viewModel = new quizzesAdminDetailViewModel(db.quiz, "Quiz details", "", "", "/admin/quizzes");

      const data = await db.quiz.getByPK(id);

      if (!data) {
        viewModel.error = "Quiz not found";
        viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", description: "N/A" };
      } else {
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: data["id"] || "N/A",
          name: data["name"] || "N/A",
          description: data["description"] || "N/A",
        };
      }

      res.render("admin/View_Quizzes", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = { ...viewModel.detail_fields, id: "N/A", name: "N/A", description: "N/A" };
      res.render("admin/View_Quizzes", viewModel);
    }
  }
);

app.get("/admin/quizzes-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const quizzesAdminDeleteViewModel = require("../../view_models/quizzes_admin_delete_view_model");

  const viewModel = new quizzesAdminDeleteViewModel(db.quiz);

  try {
    const exists = await db.quiz.getByPK(id);

    if (!exists) {
      req.flash("error", "Quiz not found");
      return res.redirect("/admin/quizzes/0");
    }

    viewModel.session = req.session;

    await db.quiz.realDelete(id);
    await db.question.destroy({
      where: {
        quiz_id: id,
      },
    });

    await db.activity_log.insert({
      action: "DELETE",
      name: "Admin_quiz_controller.js",
      portal: "admin",
      data: JSON.stringify(exists),
    });

    req.flash("success", "Quiz was deleted successfully");

    return res.redirect("/admin/quizzes/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/quizzes/0");
  }
});

// APIS

app.get("/admin/api/quizzes", async function (req, res, next) {
  try {
    const session = req.session;
    let listViewModel = require("../../view_models/quizzes_admin_list_paginate_view_model");
    let viewModel = new listViewModel(db.quiz, "Quizzes", session.success, session.error, "/admin/quizzes");
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
    viewModel.set_name(req.query.name ? req.query.name : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      name: viewModel.get_name(),
    });

    const { rows: allItems, count } = await db.quiz.findAndCountAll({
      where: where,
      limit: limit == 0 ? null : limit,
      offset: offset,
      // include: { all: true, nested: true },
      include: [
        {
          model: db.question,
          as: "questions",
          order: [["order", "ASC"]],
          separate: true,
          required: false,
          include: [
            {
              model: db.answer,
              as: "answers",
              required: false,
              separate: true,
              order: [["order", "ASC"]],
              include: [{ model: db.image, as: "image", required: false }],
            },
          ],
        },
      ],
      order: [["id", direction]],
      distinct: true,
    });

    for (const row of allItems) {
      if (row.questions) {
        for (const question of row.questions) {
          if (question.answers) {
            for (const answer of question.answers) {
              if (answer.black_list_actives) {
                const blActivesListIds = JSON.parse(answer.black_list_actives);
                const blActivesListNames = await db.active
                  .findAll({
                    where: {
                      id: blActivesListIds,
                    },
                  })
                  .then((data) => {
                    return data.map((item) => {
                      item = item.name;
                      return item;
                    });
                  });
                answer.black_list_actives = JSON.stringify(blActivesListNames);
              }
            }
          }
        }
      }
    }
    const response = {
      items: allItems,
      page,
      nextPage: limit == 0 ? false : count > offset + limit ? page + 1 : false,
      retrievedCount: allItems.length,
      fullCount: count,
    };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

module.exports = app;
