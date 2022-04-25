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

app.get("/admin/questions/:num", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  try {
    let session = req.session;
    let paginateListViewModel = require("../../view_models/questions_admin_list_paginate_view_model");

    var viewModel = new paginateListViewModel(db.question, "Questiones", session.success, session.error, "/admin/questions");

    const format = req.query.format ? req.query.format : "view";
    const direction = req.query.direction ? req.query.direction : "ASC";
    const per_page = req.query.per_page ? req.query.per_page : 10;
    // req.query.order_by ? req.query.order_by :
    let order_by = [
      ["quiz_id", direction],
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
    viewModel.set_quiz_id(req.query.quiz_id ? req.query.quiz_id : "");
    viewModel.set_type(req.query.type ? req.query.type : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      quiz_id: viewModel.get_quiz_id(),
      type: viewModel.get_type(),
    });

    const count = await db.question._count(where, [
      { model: db.quiz, as: "quiz", required: true },
      { model: db.answer, as: "answers", required: false },
    ]);

    viewModel.set_total_rows(count);
    viewModel.set_per_page(+per_page);
    viewModel.set_page(+req.params.num);
    viewModel.set_query(req.query);
    viewModel.set_sort_base_url(`/admin/questions/${+req.params.num}`);
    viewModel.set_sort(direction);

    const list = await db.question.getPaginatedV2(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, [
      { model: db.quiz, as: "quiz", required: true },
      { model: db.answer, as: "answers", required: false },
    ]);

    viewModel.set_list(list);

    viewModel.quiz = await db.quiz;

    if (format == "csv") {
      const csv = viewModel.to_csv();
      return res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="export.csv"',
        })
        .send(csv);
    }
    return res.render("admin/Questions", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Questions", viewModel);
  }
});

app.get("/admin/questions-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }

  const questionsAdminAddViewModel = require("../../view_models/questions_admin_add_view_model");

  const viewModel = new questionsAdminAddViewModel(db.question, "Add question", "", "", "/admin/questions");
  viewModel.quizzes = await db.quiz.getAll();
  for (const quiz of viewModel.quizzes) {
    const question = await db.question.findAll({
      where: {
        quiz_id: quiz.id,
      },
      limit: 1,
      order: [["order", "DESC"]],
    });
    quiz.lastOrder = question[0].order;
  }
  viewModel.questions = await db.question.getAll();
  viewModel.outputVariables = await db.output_variable.getAll();
  res.render("admin/Add_Questions", viewModel);
});

app.post(
  "/admin/questions-add",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { quiz_id: "required", question: "required", type: "required", order: "required" },
    {
      "quiz_id.required": "QuizId is required",
      "question.required": "Question is required",
      "type.required": "Type is required",
      "order.required": "Order is required",
    }
  ),
  async function (req, res, next) {
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    const questionsAdminAddViewModel = require("../../view_models/questions_admin_add_view_model");

    const viewModel = new questionsAdminAddViewModel(db.question, "Add question", "", "", "/admin/questions");
    viewModel.quizzes = await db.quiz.getAll();
    viewModel.questions = await db.question.getAll();
    viewModel.outputVariables = await db.output_variable.getAll();

    // TODO use separate controller for image upload
    //  {{{upload_field_setter}}}

    const { quiz_id, question, order, image_width, image_height, note, note_type, depends_on, slider_range, output_variable_name, weight, extra_output_variable, type } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      quiz_id,
      question,
      order,
      note,
      image_width,
      image_height,
      note_type,
      depends_on,
      slider_range,
      output_variable_name,
      weight,
      extra_output_variable,
      type,
    };

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Add_Questions", viewModel);
      }

      viewModel.session = req.session;

      const data = await db.question.insert({
        quiz_id,
        question,
        order,
        image_width: image_width ? image_width : null,
        image_height: image_height ? image_height : null,
        note: note ? note : null,
        note_type: note_type ? note_type : null,
        depends_on: depends_on ? depends_on : null,
        slider_range: slider_range ? slider_range : null,
        output_variable_name: output_variable_name ? output_variable_name : null,
        weight: weight ? weight : null,
        extra_output_variable: extra_output_variable ? extra_output_variable : null,
        type,
      });

      if (!data) {
        viewModel.error = "Something went wrong";
        return res.render("admin/Add_Questions", viewModel);
      }

      req.flash("success", "Question created successfully");
      return res.redirect("/admin/questions/0");
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      return res.render("admin/Add_Questions", viewModel);
    }
  }
);

app.get("/admin/questions-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  const questionsAdminEditViewModel = require("../../view_models/questions_admin_edit_view_model");

  const viewModel = new questionsAdminEditViewModel(db.question, "Edit question", "", "", "/admin/questions");
  const flashMessageSuccess = req.flash("success");
  if (flashMessageSuccess && flashMessageSuccess.length > 0) {
    viewModel.success = flashMessageSuccess[0];
  }
  const flashMessageError = req.flash("error");
  if (flashMessageError && flashMessageError.length > 0) {
    viewModel.error = flashMessageError[0];
  }
  try {
    const exists = await db.question.findOne({
      where: { id },
      order: [["answers", "order", "ASC"]],
      include: [{ model: db.answer, as: "answers", include: [{ model: db.image, as: "image" }] }],
    });

    if (!exists) {
      req.flash("error", "Question not found");
      return res.redirect("/admin/questions/0");
    }
    const values = exists;
    Object.keys(viewModel.form_fields).forEach((field) => {
      viewModel.form_fields[field] = values[field] || "";
    });
    viewModel.question = exists;
    viewModel.quiz = db.quiz;
    viewModel.quizzes = await db.quiz.getAll();
    viewModel.questions = await db.question.getAll();
    viewModel.outputVariables = await db.output_variable.getAll();
    viewModel.actives = await db.active.getAll();
    viewModel.nextQuestionId;
    let lastQuestionId = await db.question.findAll({ order_by: ["id", "DESC"] }).then((data) => data[0].id);
    let found = false;
    let nextId = parseInt(exists.id) + 1;
    while (!found) {
      const nextQuestion = await db.question.getByPK(nextId);
      if (nextQuestion) {
        viewModel.nextQuestionId = nextQuestion.id;
        found = true;
      } else {
        if (nextId >= lastQuestionId) break;
      }
      nextId++;
    }
    //remaining actives unselected
    if (exists.answers && exists.answers?.length > 0) {
      viewModel.lastOrderCount = exists.answers[exists.answers.length - 1].order;
    }

    return res.render("admin/Edit_Questions", viewModel);
  } catch (error) {
    console.error(error);
    viewModel.error = error.message || "Something went wrong";
    return res.render("admin/Edit_Questions", viewModel);
  }
});
app.get("/admin/answers/refill/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;
  if (req.session.csrf === undefined) {
    req.session.csrf = SessionService.randomString(100);
  }
  try {
    const actives = await db.active.getAll();
    await db.answer.destroy({ where: { question_id: id } });

    await db.answer.insert({
      question_id: id,
      order: 1,
      answer: "Banana",
    });
    await db.answer.insert({
      question_id: id,
      order: 2,
      answer: "Olive",
    });
    await db.answer.insert({
      question_id: id,
      order: 3,
      answer: "Sunflowers",
    });

    let order = 3;
    for (const active of actives) {
      if (active.name !== "Blank") {
        await db.answer.insert({
          question_id: id,
          order: order + 1,
          answer: active.name,
        });
      }
      order++;
    }
    req.flash("success", "Answers refilled successfully");
    return res.redirect("/admin/questions-edit/" + id);
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/questions-edit/" + id);
  }
});

app.post(
  "/admin/questions-edit/:id",
  SessionService.verifySessionMiddleware(role, "admin"),
  ValidationService.validateInput(
    { quiz_id: "required", question: "required", type: "required", question_order: "required" },
    {
      "quiz_id.required": "QuizId is required",
      "question.required": "Question is required",
      "type.required": "Type is required",
      "question_order.required": "Order is required",
    }
  ),
  async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const questionsAdminEditViewModel = require("../../view_models/questions_admin_edit_view_model");

    const viewModel = new questionsAdminEditViewModel(db.question, "Edit question", "", "", "/admin/questions");
    viewModel.quizzes = await db.quiz.getAll();
    viewModel.questions = await db.question.getAll();
    viewModel.outputVariables = await db.output_variable.getAll();
    viewModel.nextQuestionId;
    let lastQuestionId = await db.question.findAll({ order_by: ["id", "DESC"] }).then((data) => data[0].id);
    let found = false;
    let nextId = parseInt(id) + 1;
    while (!found) {
      const nextQuestion = await db.question.getByPK(nextId);
      if (nextQuestion) {
        viewModel.nextQuestionId = nextQuestion.id;
        found = true;
      } else {
        if (nextId >= lastQuestionId) break;
      }
      nextId++;
    }

    const { quiz_id, question, question_order, note, image_width, image_height, note_type, depends_on, slider_range, output_variable_name, weight, extra_output_variable, type } = req.body;
    const { ids, answer, answer_value, hide_answer, explaination, image_id, response_header, response_body } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      quiz_id,
      question,
      order: question_order,
      note,
      image_width,
      image_height,
      note_type,
      depends_on,
      slider_range,
      output_variable_name,
      weight,
      extra_output_variable,
      type,
    };

    delete viewModel.form_fields.id;

    try {
      if (req.validationError) {
        console.error(error);
        req.flash("error", req.validationError);
        return res.redirect(`/admin/questions-edit/${id}`);
      }

      const resourceExists = await db.question.getByPK(id);
      if (!resourceExists) {
        req.flash("error", "Question not found");
        return res.redirect(`/admin/questions-edit/${id}`);
      }

      viewModel.session = req.session;
      await db.question.edit(
        {
          quiz_id,
          question,
          question_order,
          type,
          image_width: image_width ? image_width : null,
          image_height: image_height ? image_height : null,
          note: note ? note : null,
          note_type: note_type ? note_type : null,
          depends_on: depends_on ? depends_on : null,
          slider_range: slider_range ? slider_range : null,
          output_variable_name: output_variable_name ? output_variable_name : null,
          weight: weight ? weight : null,
          extra_output_variable: extra_output_variable ? extra_output_variable : null,
        },
        id
      );
      if (Array.isArray(ids) && ids.length) {
        for (let i = 0; i < ids.length; i++) {
          await db.answer.edit(
            {
              answer: answer[i] ? answer[i] : null,
              answer_value: answer_value[i] ? answer_value[i] : null,
              hide_answer: hide_answer[i] ? hide_answer[i] : null,
              order: i + 1,
              explaination: explaination[i] ? explaination[i] : null,
              image_id: image_id[i] ? image_id[i] : null,
              response_header: response_header[i] ? response_header[i] : null,
              response_body: response_body[i] ? response_body[i] : null,
              black_list_actives: req.body[`black_list_actives_${ids[i]}`]
                ? !Array.isArray(req.body[`black_list_actives_${ids[i]}`])
                  ? JSON.stringify([req.body[`black_list_actives_${ids[i]}`]])
                  : JSON.stringify(req.body[`black_list_actives_${ids[i]}`])
                : null,
            },
            ids[i]
          );
        }
      } else if (!Array.isArray(ids) && ids) {
        await db.answer.edit(
          {
            answer: answer ? answer : null,
            answer_value: answer_value ? answer_value : null,
            hide_answer: hide_answer ? hide_answer : null,
            order: 1,
            explaination: explaination ? explaination : null,
            image_id: image_id ? image_id : null,
            response_header: response_header ? response_header : null,
            response_body: response_body ? response_body : null,
            black_list_actives: req.body[`black_list_actives_${ids}`]
              ? !Array.isArray(req.body[`black_list_actives_${ids}`])
                ? JSON.stringify([req.body[`black_list_actives_${ids}`]])
                : JSON.stringify(req.body[`black_list_actives_${ids}`])
              : null,
          },
          ids
        );
      }

      req.flash("success", "Question edited successfully");
      return res.redirect(`/admin/questions-edit/${id}`);
    } catch (error) {
      console.error(error);
      req.flash("error", error.message || "Something went wrong");
      return res.redirect(`/admin/questions-edit/${id}`);
    }
  }
);

app.get(
  "/admin/questions-view/:id",
  SessionService.verifySessionMiddleware(role, "admin"),

  async function (req, res, next) {
    try {
      let id = req.params.id;

      const questionsAdminDetailViewModel = require("../../view_models/questions_admin_detail_view_model");

      var viewModel = new questionsAdminDetailViewModel(db.question, "Question details", "", "", "/admin/questions");

      const data = await db.question.get_question_quiz(id, db);
      data.type = db.question.type_mapping()[data.type];
      data.target = db.question.target_mapping()[data.target];
      data.note_type = db.question.note_type_mapping()[data.note_type];

      if (!data) {
        viewModel.error = "Question not found";
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: "N/A",
          "quiz.name": "N/A",
          question: "N/A",
          question_arguments: "N/A",
          order: "N/A",
          note: "N/A",
          note_type: "N/A",
          target: "N/A",
          response: "N/A",
          save_response_into: "N/A",
          depends_on: "N/A",
          slider_range: "N/A",
          output_variable_name: "N/A",
          weight: "N/A",
          extra_output_variable: "N/A",
          type: "N/A",
        };
      } else {
        viewModel.detail_fields = {
          ...viewModel.detail_fields,
          id: data["id"] || "N/A",
          "quiz.name": data["quiz"]["name"] || "N/A",
          question: data["question"] || "N/A",
          question_arguments: data["question_arguments"] || "N/A",
          order: data["order"] || "N/A",
          note: data["note"] || "N/A",
          note_type: data["note_type"] || "N/A",
          target: data["target"] || "N/A",
          response: data["response"] || "N/A",
          save_response_into: data["save_response_into"] || "N/A",
          depends_on: data["depends_on"] || "N/A",
          slider_range: data["slider_range"] || "N/A",
          output_variable_name: data["output_variable_name"] || "N/A",
          weight: data["weight"] || "N/A",
          extra_output_variable: data["extra_output_variable"] || "N/A",
          type: data["type"] || "N/A",
        };
      }

      res.render("admin/View_Questions", viewModel);
    } catch (error) {
      console.error(error);
      viewModel.error = error.message || "Something went wrong";
      viewModel.detail_fields = {
        ...viewModel.detail_fields,
        id: "N/A",
        "quiz.name": "N/A",
        question: "N/A",
        question_arguments: "N/A",
        order: "N/A",
        note: "N/A",
        note_type: "N/A",
        target: "N/A",
        response: "N/A",
        save_response_into: "N/A",
        depends_on: "N/A",
        slider_range: "N/A",
        output_variable_name: "N/A",
        weight: "N/A",
        extra_output_variable: "N/A",
        type: "N/A",
      };
      res.render("admin/View_Questions", viewModel);
    }
  }
);

app.get("/admin/questions-delete/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
  let id = req.params.id;

  const questionsAdminDeleteViewModel = require("../../view_models/questions_admin_delete_view_model");

  const viewModel = new questionsAdminDeleteViewModel(db.question);

  try {
    const exists = await db.question.getByPK(id);

    if (!exists) {
      req.flash("error", "Question not found");
      return res.redirect("/admin/questions/0");
    }

    viewModel.session = req.session;

    await db.question.realDelete(id);
    await db.answer.destroy({
      where: { question_id: id },
    });
    req.flash("success", "Question was deleted successfully");

    return res.redirect("/admin/questions/0");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message || "Something went wrong");
    return res.redirect("/admin/questions/0");
  }
});

// APIS

app.get("/admin/api/questions", async function (req, res, next) {
  try {
    const session = req.session;
    let listViewModel = require("../../view_models/questions_admin_list_paginate_view_model");
    let viewModel = new listViewModel(db.question, "Questiones", session.success, session.error, "/admin/questions");
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
    viewModel.set_quiz_id(req.query.quiz_id ? req.query.quiz_id : "");
    viewModel.set_type(req.query.type ? req.query.type : "");

    let where = helpers.filterEmptyFields({
      id: viewModel.get_id(),
      quiz_id: viewModel.get_quiz_id(),
      type: viewModel.get_type(),
    });
    const { rows: allItems, count } = await db.question.findAndCountAll({
      where: where,
      limit: limit == 0 ? null : limit,
      offset: offset,
      include: { all: true, nested: true },
      order: [["id", direction]],
      distinct: true,
    });

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
