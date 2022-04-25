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

app.get("/admin/terminate/", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    const data = await db.terminate.findAll()

    const terminateAdminAddViewModel = require("../../view_models/terminate_admin_add_view_model");
    const viewModel = new terminateAdminAddViewModel(db.terminate, "Terminate", data, "", "", "/admin/terminate");

    res.render("admin/Terminate", viewModel)
})

app.get("/admin/terminate-view/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
        try {
            let id = req.params.id;

            const terminateAdminDetailViewModel = require("../../view_models/terminate_admin_detail_view_model");

            var viewModel = new terminateAdminDetailViewModel(db.terminate, "Terminate details", "", "", "/admin/terminate");

            const data = await db.terminate.findOne({
                where: {
                    id
                }
            });

            if (!data) {
                viewModel.error = "Terminate not found";
                viewModel.detail_fields = {
                    ...viewModel.detail_fields,
                    id: "N/A",
                    message: "N/A",
                    counter: "N/A"
                };
            } else {
                viewModel.detail_fields = {
                    ...viewModel.detail_fields,
                    id: data["id"] || "N/A",
                    message: data["message"] || "N/A",
                    counter: data["counter"] || "N/A",
                };
            }

            res.render("admin/View_Terminate", viewModel);
        } catch (error) {
            console.error(error);
            viewModel.error = error.message || "Something went wrong";
            viewModel.detail_fields = {
                ...viewModel.detail_fields,
                id: "N/A",
                message: "N/A",
                counter: "N/A"
            };
            res.render("admin/View_Terminate", viewModel);
        }
    }
);

app.get("/admin/terminate-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    if (req.session.csrf === undefined) {
        req.session.csrf = SessionService.randomString(100);
    }

    const terminateAdminAddViewModel = require("../../view_models/terminate_admin_add_view_model");

    const viewModel = new terminateAdminAddViewModel(db.terminate, "Add terminate", [], "", "", "/admin/terminate");
    res.render("admin/Add_Terminate", viewModel)
})

app.post("/admin/terminate-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    if (req.session.csrf === undefined) {
        req.session.csrf = SessionService.randomString(100);
    }
    const terminateAdminAddViewModel = require("../../view_models/terminate_admin_add_view_model");
    const viewModel = new terminateAdminAddViewModel(db.terminate, "Add terminate", [], "", "", "/admin/terminate");

    const {
        message,
        counter
    } = req.body;

    console.log(req.body);

    viewModel.form_fields = {
        ...viewModel.form_fields,
        message,
        counter,
    };

    try {
        if (req.validationError) {
            viewModel.error = req.validationError;
            return res.render("admin/Add_Terminate", viewModel);
        }

        viewModel.session = req.session;

        const data = await db.terminate.insert({
            message,
            counter
        });

        if (!data) {
            viewModel.error = "Something went wrong";
            return res.render("admin/Add_Terminate", viewModel);
        }

        await db.activity_log.insert({
            action: "ADD",
            message: "Admin_terminate_controller.js",
            portal: "admin",
            data: JSON.stringify({
                message,
                counter
            }),
        });

        req.flash("success", "Terminate created successfully");
        return res.redirect("/admin/terminate");
    } catch (error) {
        console.error(error);
        viewModel.error = error.message || "Something went wrong";
        return res.render("admin/Add_Terminate", viewModel);
    }
})

app.post("/admin/terminate-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), ValidationService.validateInput({ message: "required" }, { "message.required": "Message is required" }), async function (req, res, next) {
        let id = req.params.id;
        if (req.session.csrf === undefined) {
            req.session.csrf = SessionService.randomString(100);
        }

        const terminateAdminEditViewModel = require("../../view_models/terminate_admin_edit_view_model");

        const viewModel = new terminateAdminEditViewModel(db.terminate, "Edit terminate", "", "", "/admin/terminate");

        const {
            message,
            counter
        } = req.body;

        viewModel.form_fields = {
            ...viewModel.form_fields,
            counter,
            message,
        };

        delete viewModel.form_fields.id;

        try {
            if (req.validationError) {
                viewModel.error = req.validationError;
                return res.render("admin/Edit_Terminate", viewModel);
            }

            const resourceExists = await db.terminate.findOne({ where: {id}});
            if (!resourceExists) {
                req.flash("error", "Terminate not found");
                return res.redirect("/admin/terminate");
            }

            viewModel.session = req.session;

            let data = await db.terminate.edit({
                message,
                counter
            }, id);
            if (!data) {
                viewModel.error = "Something went wrong";
                return res.render("admin/Edit_Terminate", viewModel);
            }

            await db.activity_log.insert({
                action: "EDIT",
                name: "Admin_terminate_controller.js",
                portal: "admin",
                data: JSON.stringify({
                    message,
                    counter
                }),
            });

            req.flash("success", "terminate edited successfully");

            return res.redirect("/admin/terminate/");
        } catch (error) {
            console.error(error);
            viewModel.error = error.message || "Something went wrong";
            return res.render("admin/Edit_Terminate", viewModel);
        }
    }
);

app.get("/admin/api/terminate", async function (req, res, next) {
    try{
        const data = await db.terminate.findOne({ 
            where: {
                id: 1
            }
        })
    
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error})
    }
})

app.get("/admin/terminate-edit/:id", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    let id = req.params.id;
    if (req.session.csrf === undefined) {
        req.session.csrf = SessionService.randomString(100);
    }
    const terminateAdminEditViewModel = require("../../view_models/terminate_admin_edit_view_model");

    const viewModel = new terminateAdminEditViewModel(db.terminate, "Edit terminate", "", "", "/admin/terminate");

    try {
        const exists = await db.terminate.findOne({where: { id }});

        if (!exists) {
            req.flash("error", "terminate not found");
            return res.redirect("/admin/terminate");
        }
        const values = exists;
        Object.keys(viewModel.form_fields).forEach((field) => {
            viewModel.form_fields[field] = values[field] || "";
        });
        viewModel.question = db.question;
        return res.render("admin/Edit_Terminate", viewModel);
    } catch (error) {
        console.error(error);
        viewModel.error = error.message || "Something went wrong";
        return res.render("admin/Edit_Terminate", viewModel);
    }
});

app.delete("/admin/terminate-delete", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
    const { id } = req.params

    try {
        await db.terminate.deleteOne({
            where: { id }
        })

        const data = await db.terminate.findAll()

        const terminateAdminAddViewModel = require("../../view_models/terminate_admin_add_view_model");
        const viewModel = new terminateAdminAddViewModel(db.terminate, "Terminate", data, "", "", "/admin/terminate");

        res.render("admin/Terminate", viewModel)

    } catch (err) {
        console.error(error);
        viewModel.error = error.message || "Something went wrong";
        return res.render("admin/Terminate", viewModel)
    }
})

module.exports = app;