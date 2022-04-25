'use strict';

const ValidationService = require('../../services/ValidationService')
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const db = require("../../models");
const app = require('express').Router();

const role_id = 2

app.get('/member/register',
SessionService.preventAuthRoutes(role_id, 'member')
, async function (req, res, next) {
    

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user, "Register")

    return res.render("member/Register", viewModel)

  });

app.post('/member/register',

ValidationService.validateInput({
email:"required|email",
first_name:"required", 
last_name:"required",
password:"required|minLength:6",
confirm_password:"required|minLength:6"
},{
"email.required":"Email is required", 
"first_name.required":"First name is required", 
"last_name.required":"Last name is required", 
"email.email":"Invalid email",
"password.required":"Password is required.",
"confirm_password.required":"Password is required.",
"password.minLength":"Password should be at least 6 characters long.",
"confirm_password.minLength":"Password should be at least 6 characters long."
})

,async function (req, res, next) {
    const role_id = 2
    const {email,first_name, last_name, password, confirm_password} = req.body;

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user,"Register")


   
    ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        'member/Register',
        'register_fields',
        { email, first_name, last_name },
      );

    let newUser = null

try {
    if(password!==confirm_password){
        viewModel.error = "Passwords do not match"
        viewModel.register_fields.email = email
        viewModel.register_fields.first_name = first_name
        viewModel.register_fields.last_name = last_name
        return res.render("member/Register",viewModel )
    }

    var { credential, user } = await AuthService.register(
        email,
        password,
        role_id,
        {
          first_name,
          last_name,
        },
      );

      if(user){
        const session = req.session;
        session.role = role_id;
        session.user = user;
        session.credential = credential;

        return session.save((error) => {
          if(error){
              throw new Error(error)
          }
          return res.redirect("/member/dashboard")
        })
      }
   
      throw new Error();


} catch (error) {
    if(user){
      await  db.user.destroy(user)
    }
    viewModel.error = error.message ||  "Something went wrong";
    viewModel.register_fields.email = email
    viewModel.register_fields.first_name = first_name
    viewModel.register_fields.last_name = last_name
    return res.render("member/Register",viewModel )}
  });

module.exports = app;

