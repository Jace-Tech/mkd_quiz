"use strict";

const ValidationService = require("../../services/ValidationService");
const AuthService = require("../../services/AuthService");
const JWTService = require("../../services/JwtService");
const SessionService = require("../../services/SessionService");
const db = require("../../models");
const errors = require("../../core/errors");
const app = require("express").Router();
const role_id = 1;

app.get("/admin/login", SessionService.preventAuthRoutes(role_id, "admin"), async function (req, res, next) {
  const AuthViewModel = require("../../view_models/admin_auth_view_model");

  const viewModel = new AuthViewModel(db.user, "Login");
  req.session.redirect_to = req.query.redirect_to;

  return res.render("admin/Login", viewModel);
});

app.post(
  "/admin/login",

  ValidationService.validateInput(
    {
      email: "required|email",
      password: "required|minLength:6",
    },
    {
      "email.required": "Email is required",
      "email.email": "Invalid email",
      "password.required": "Password is required.",
      "password.minLength": "Password should be at least 6 characters long.",
    }
  ),

  async function (req, res, next) {
    const role_id = 1;
    const { email, password } = req.body;

    const AuthViewModel = require("../../view_models/admin_auth_view_model");

    const viewModel = new AuthViewModel(db.user, "Login");

    ValidationService.handleValidationErrorForViews(req, res, viewModel, "admin/Login", "login_fields", { email });

    try {
      const { credential, user } = await AuthService.login(email, password, role_id);

      const session = req.session;

      session.role = role_id;
      session.user = user;
      session.credential = credential;

      return session.save((error) => {
        if (error) {
          throw new Error(error);
        }
        if (session.redirect_to) {
          return res.redirect(session.redirect_to);
        }
        return res.redirect("/admin/dashboard");
      });
    } catch (error) {
      viewModel.error = error.message || "Something went wrong";
      viewModel.login_fields.email = email;
      return res.render("admin/Login", viewModel);
    }
  }
);

module.exports = app;
