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

app.get("/admin/answers/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/answers_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.answer, "Answers", session.success, session.error, "/admin/answers");

    const format = req.query.format ? req.query.format : "view";
    const direction = req.query.direction ? req.query.direction : "ASC";
    const per_page = req.query.per_page ? req.query.per_page : 10;
    // let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
    let order_by = [
      ["question", "quiz_id", direction],
      ["question", "order", direction],
      ["question_id", direction],
      ["order", direction],
    ];
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
    viewModel.set_question_id(req.query.question_id ? req.query.question_id : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      question_id: viewModel.get_question_id(),
    });

    const count = await db.answer._count(where, [{ all: true, nested: true }]);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/answers/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.answer.getPaginatedV2(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, [{ all: true, nested: true }]);

    viewModel.set_list(list);

    viewModel.question = await db.question;
    viewModel.image = await db.image;

    if (format == "csv") {
      const csv = viewModel.to_csv();
      return res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="export.csv"',
        })
        .send(csv);
    }

    return res.render("admin/Answers", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Answers", viewModel);
  }
});

app.get("/admin/answers-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const answersAdminAddViewModel = require("../../view_models/answers_admin_add_view_model");

  const viewModel = new answersAdminAddViewModel(db.answer, "Add answer", "", "", "/admin/answers");
  viewModel.questions = await db.question.getAll({
    type: {
      [Sequelize.Op.notIn]: [1, 2, 3],
    },
  });
  viewModel.actives = await db.active.getAll();
  res.render("admin/Add_Answers", viewModel);
});

app.post(
  "/admin/answers-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ question_id: "required", order: "required" }, { "question_id.required": "QuestionId is required", "order.required": "Order is required" }),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const addedFromQuestion = req.query.question;
    const answersAdminAddViewModel = require("../../view_models/answers_admin_add_view_model");

    const viewModel = new answersAdminAddViewModel(db.answer, "Add answer", "", "", "/admin/answers");
    viewModel.questions = await db.question.getAll({
      type: {
        [Sequelize.Op.notIn]: [1, 2, 3],
      },
    });
    viewModel.actives = await db.active.getAll();

    const {
      question_id,
      answer,
      answer_value,
      hide_answer,
      order,
      explaination,
      image_id,
      response_header,
      response_body,
      // response_arguments,
      black_list_actives,
    } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      question_id,
      answer,
      answer_value,
      hide_answer,
      order,
      explaination,
      image_id,
      response_header,
      response_body,
      // response_arguments,
      black_list_actives,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        if (addedFromQuestion) {
          req.flash("error", req.validationError);
          return res.redirect(`/admin/questions-edit/${addedFromQuestion}`);
        }
        return res.render("admin/Add_Answers", viewModel);
      }

      viewModel.session = req.session;

      const data = await db.answer.insert(
        helpers.filterEmptyFields({
          question_id,
          answer,
          answer_value,
          hide_answer,
          order,
          explaination,
          image_id,
          response_header,
          response_body,
          // response_arguments,
          black_list_actives: !Array.isArray(black_list_actives) ? JSON.stringify([black_list_actives]) : JSON.stringify(black_list_actives),
        })
      );

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Answers", viewModel);
      }

      await db.activity_log.insert({
        action: "ADD",
        name: "Admin_answer_controller.js",
        portal: "admin",
        data: JSON.stringify({
          question_id,
          answer,
          answer_value,
          hide_answer,
          order,
          explaination,
          image_id,
          response_header,
          response_body,
          // response_arguments,
          black_list_actives: !Array.isArray(black_list_actives) ? JSON.stringify([black_list_actives]) : JSON.stringify(black_list_actives),
        }),
      });
      if (addedFromQuestion) {
        req.flash("success", "Answer created successfully");
        return res.redirect(`/admin/questions-edit/${addedFromQuestion}`);
      }
      req.flash("success", "Answer created successfully");
      return res.redirect("/admin/answers/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      if (addedFromQuestion) {
        req.flash("error", viewModel.error);
        return res.redirect(`/admin/questions-edit/${addedFromQuestion}`);
      }
      return res.render("admin/Add_Answers", viewModel);
    }
  }
);

app.get("/admin/answers-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const answersAdminEditViewModel = require("../../view_models/answers_admin_edit_view_model");

  const viewModel = new answersAdminEditViewModel(db.answer, "Edit answer", "", "", "/admin/answers");

  try {
    const exists = await db.answer.findOne({
      where: {
        id,
      },
      include: [{ all: true, nested: true }],
    });

    if (!exists) {
      req.flash("error", "Answer not found");
      return res.redirect("/admin/answers/0");
    }

    viewModel.answer = exists;
    viewModel.question = await db.question.getByPK(exists.question_id);
    viewModel.questions = await db.question.getAll({
      type: {
        [Sequelize.Op.notIn]: [1, 2, 3],
      },
    });
    viewModel.actives = await db.active.getAll();
    return res.render("admin/Edit_Answers", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Answers", viewModel);
  }
});

app.post(
  "/admin/answers-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { question_id: "required", answer: "required", order: "required" },
    { "question_id.required": "QuestionId is required", "answer.required": "Answer is required", "order.required": "Order is required" }
  ),
  async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const answersAdminEditViewModel = require("../../view_models/answers_admin_edit_view_model");

    const viewModel = new answersAdminEditViewModel(db.answer, "Edit answer", "", "", "/admin/answers");
    viewModel.questions = await db.question.getAll({
      type: {
        [Sequelize.Op.notIn]: [1, 2, 3],
      },
    });
    viewModel.actives = await db.active.getAll();
    const {
      question_id,
      answer,
      answer_value,
      hide_answer,
      order,
      explaination,
      image_id,
      response_header,
      response_body,
      // response_arguments,
      black_list_actives,
    } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      question_id,
      answer,
      answer_value,
      hide_answer,
      order,
      explaination,
      image_id,
      response_header,
      response_body,
      // response_arguments,
      black_list_actives,
    };

    delete viewModel.form_fields.id;

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Edit_Answers", viewModel);
      }

      const resourceExists = await db.answer.getByPK(id);
      if (!resourceExists) {
        req.flash("error", "Answer not found");
        return res.redirect("/admin/answers/0");
      }

      viewModel.question = await db.question.getByPK(resourceExists.question_id);
      viewModel.session = req.session;

      let data = await db.answer.edit(
        helpers.filterEmptyFields({
          question_id,
          answer,
          answer_value,
          hide_answer,
          order,
          explaination,
          image_id,
          response_header,
          response_body,
          // response_arguments,
          black_list_actives: JSON.stringify(black_list_actives),
        }),
        id
      );
      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Edit_Answers", viewModel);
      }

      if (resourceExists.question) {
        data = await db.question.edit(helpers.filterEmptyFields({}), resourceExists.question.id);
        if (!data) {
          viewModel.error = "Something went wrong";
          return res.render("admin/Edit_Answers", viewModel);
        }
      }

      await db.activity_log.insert({
        action: "EDIT",
        name: "Admin_answer_controller.js",
        portal: "admin",
        data: JSON.stringify({
          question_id,
          answer,
          answer_value,
          order,
          explaination,
          image_id,
          response_header,
          response_body,
          // response_arguments,
          black_list_actives: JSON.stringify(black_list_actives),
        }),
      });

      req.flash("success", "Answer edited successfully");

      return res.redirect("/admin/answers/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Edit_Answers", viewModel);
    }
  }
);

app.get(
  "/admin/answers-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const answersAdminDetailViewModel = require("../../view_models/answers_admin_detail_view_model");

      var viewModel = new answersAdminDetailViewModel(db.answer, "Answer details", "", "", "/admin/answers");

      const data = await db.answer.findOne({
        where: {
          id,
        },
        include: [{ all: true, nested: true }],
      });

      data["question.note_type"] = db.question.note_type_mapping()[data.question.note_type];
      data["question.target"] = db.question.target_mapping()[data.question.target];
      data["question.type"] = db.question.type_mapping()[data.question.type];

      if (!data) {
        viewModel.error = "Answer not found";
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: "N/A",
          question_id: "N/A",
          "question.question": "N/A",
          answer: "N/A",
          answer_value: "N/A",
          order: "N/A",
          explaination: "N/A",
          image_id: "N/A",
          response_header: "N/A",
          response_body: "N/A",
          response_arguments: "N/A",
          black_list_actives: "N/A",
        };
      } else {
        viewModel.answer = data;
      }

      res.render("admin/View_Answers", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = {
        ...viewModel.detail_fields,
        id: "N/A",
        question_id: "N/A",
        "question.question": "N/A",
        answer: "N/A",
        answer_value: "N/A",
        order: "N/A",
        explaination: "N/A",
        image_id: "N/A",
        response_header: "N/A",
        response_body: "N/A",
        response_arguments: "N/A",
        black_list_actives: "N/A",
      };
      res.render("admin/View_Answers", viewModel);
    }
  }
);

app.get("/admin/answers-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const answersAdminDeleteViewModel = require("../../view_models/answers_admin_delete_view_model");

  const viewModel = new answersAdminDeleteViewModel(db.answer);

  try {
    const exists = await db.answer.getByPK(id);

    if (!exists) {
      req.flash("error", "Answer not found");
      return res.redirect("/admin/answers/0");
    }

    viewModel.session = req.session;

    await db.answer.realDelete(id);

    await db.activity_log.insert({
      action: "DELETE",
      name: "Admin_answer_controller.js",
      portal: "admin",
      data: JSON.stringify(exists),
    });

    req.flash("success", "Answer was deleted successfully");

    return res.redirect("/admin/answers/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/answers/0");
  }
});

// APIS

app.get("/admin/api/answers", JwtService.verifyTokenMiddleware(role), async function (req, res, next) {
  try {
    const user_id = req.user_id;
    const session = req.session;
    let listViewModel = require("../../view_models/answers_admin_list_paginate_view_model");
    let viewModel = new listViewModel(db.answer, "Answers", session.success, session.error, "/admin/answers");
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
    viewModel.set_question_id(req.query.question_id ? req.query.question_id : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      question_id: viewModel.get_question_id(),
    });

    let associatedWhere = helpers.filterEmptyFields({});
    const isAssociationRequired = Object.keys(associatedWhere).length > 0 ? true : false;

    let include = [{ model: db.question, where: associatedWhere, required: isAssociationRequired, as: "question" }];

    const { rows: allItems, count } = await db.answer.findAndCountAll({
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

app.post(
  "/admin/answers-bulk-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput({ answer: "required", order: "required" }, { "answer.required": "Answer is required", "order.required": "Order is required" }),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const questionId = req.params.id;
    const { ids, answer, answer_value, hide_answer, order, explaination, image_id, response_header, response_body } = req.body;

    try {
      if (req.validationError) {
        req.flash("error", req.validationError);
        return res.redirect(`/admin/questions-edit/${questionId}`);
      }
      for (let i = 0; i < ids.length; i++) {
        await db.answer.edit(
          helpers.filterEmptyFields({
            answer: answer ? answer[i] : null,
            answer_value: answer_value ? answer_value[i] : null,
            hide_answer: hide_answer ? hide_answer[i] : null,
            // order: order ? order[i] : null,
            order: i + 1,
            explaination: explaination ? explaination[i] : null,
            image_id: image_id ? image_id[i] : null,
            response_header: response_header ? response_header[i] : null,
            response_body: response_body ? response_body[i] : null,
            black_list_actives: req.body[`black_list_actives_${ids[i]}`] ? JSON.stringify(req.body[`black_list_actives_${ids[i]}`]) : null,
          }),
          ids[i]
        );
      }
      // req.flash("success", "Answers edited successfully");
      // return res.redirect(`/admin/questions-edit/${questionId}`);
      return res.json({ success: true, message: "Answers edited successfully" });
    } catch (error) {
      console.error(error);
      req.flash("error", error.message || "Something went wrong. please contact admin.");
      return res.redirect(`/admin/questions-edit/${questionId}`);
    }
  }
);

app.get("/admin/question/:question/answer-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let { id, question } = req.params;

  try {
    const exists = await db.answer.getByPK(id);

    if (!exists) {
      req.flash("error", "Answer not found");
      return res.redirect("/admin/questions-edit/" + question);
    }

    await db.answer.realDelete(id);

    req.flash("success", "Answer was deleted successfully");
    return res.redirect("/admin/questions-edit/" + question);
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/questions-edit/" + question);
  }
});

module.exports = app;
