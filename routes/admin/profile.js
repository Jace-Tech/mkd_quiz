"use strict";

const ValidationService = require("../../services/ValidationService");
const AuthService = require("../../services/AuthService");
const JWTService = require("../../services/JwtService");
const SessionService = require("../../services/SessionService");
const PasswordService = require("../../services/PasswordService");
const db = require("../../models");
const helpers = require("../../core/helpers");
const { validateEmail } = require("../../core/utils");
const app = require("express").Router();

const role_id = 1;

app.get(
  "/admin/profile",
  SessionService.verifySessionMiddleware(role_id, "admin"),

  async function (req, res, next) {
    const user = await db.user.getByPK(req.session.user);
    const id = user.id;

    const AuthViewModel = require("../../view_models/admin_auth_view_model");

    const viewModel = new AuthViewModel(db.user, "Profile");

    viewModel._base_url = "/admin/profile";

    if (!user || !user.id) {
      viewModel.error = "User Not Found";
      return res.render("admin/Profile", viewModel);
    }
    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    try {
      // TODO: make this responsive with no joins as well
      const exists = await db.user.get_user_credential(id, db);

      if (!exists || +exists.status === 0) {
        viewModel.error = "Profile Not Found";
        return res.render("admin/Profile", viewModel);
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
        viewModel.form_fields[field] = values[field];
      });
      viewModel.credential = db.credential;

      return res.render("admin/Profile", viewModel);
    } catch (error) {
      viewModel.error = "Something went wrong";
      return res.render("admin/Profile", viewModel);
    }
  }
);

app.post(
  "/admin/profile",

  SessionService.verifySessionMiddleware(role_id, "admin"),

  async function (req, res, next) {
    let UserRef;
    let CredentialRef;

    let User;
    let Credential;

    const user = await db.user.getByPK(req.session.user);

    const AuthViewModel = require("../../view_models/admin_auth_view_model");

    const viewModel = new AuthViewModel(db.user, "Profile");
    viewModel._base_url = "/admin/profile";

    if (!user || !user.id) {
      viewModel.error = "User Not Found";
      return res.render("admin/Profile", viewModel);
    }

    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const { first_name, last_name, credential_email, credential_password, status } = req.body;

    var credentialFields = {
      email: credential_email,
      password: credential_password,
    };

    viewModel.form_fields = {
      ...viewModel.form_fields,
      first_name,
      last_name,
      "credential.email": credential_email,
      "credential.password": credential_password,
      status,
    };

    delete credentialFields.password;
    delete viewModel.form_fields["credential.password"];

    if (credential_password && credential_password !== "" && credential_password !== null && credential_password !== undefined) {
      credentialFields.password = credential_password;
    }

    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render("admin/Profile", viewModel);
      }

      CredentialRef = await db.credential.getByFields({
        user_id: user.id,
        status: 1,
        type: 0,
      });

      if (!CredentialRef) throw new Error("Email Address Not Found");

      const credentialType = CredentialRef.type;

      UserRef = await db.user.getByFields({
        id: user.id,
        status: 1,
      });

      if (!UserRef) throw new Error("Email Address Not Found");

      if (credentialType == 0 && Object.entries(credentialFields).length > 0) {
        if (credentialFields.email) {
          if (!validateEmail(credentialFields.email)) {
            viewModel.error = "Invalid email";
            return res.render("admin/Profile", viewModel);
          }

          if (CredentialRef.email !== credentialFields.email) {
            const userExists = await db.credential.getByField("email", credentialFields.email);
            if (userExists) {
              throw new Error("Email Address Already Exists");
            }
          }
        }
        if (credentialFields.password) {
          credentialFields.password = await PasswordService.hash(credentialFields.password);
        }

        Credential = await db.credential.edit(credentialFields, CredentialRef.id);
      }
      User = await db.user.edit(
        {
          first_name,
          last_name,
          status,
        },
        UserRef.id
      );

      viewModel.success = "Profile Updated Successfully";
      return res.render("admin/Profile", viewModel);
    } catch (error) {
      console.error(error);
      try {
        if (Credential && CredentialRef) {
          await db.credential.edit(credentialFields, CredentialRef.id);
        }
        viewModel.error = error.message || "Something went wrong";
        return res.render("admin/Profile", viewModel);
      } catch (error_2) {}
      viewModel.error = error_2.message || "Something went wrong";
      return res.render("admin/Profile", viewModel);
    }
  }
);

module.exports = app;
