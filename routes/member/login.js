'use strict';

const ValidationService = require('../../services/ValidationService')
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const db = require("../../models");
const errors = require('../../core/errors');
const app = require('express').Router();
const role_id = 2

app.get('/member/login', 
SessionService.preventAuthRoutes(role_id, 'member')
,async function (req, res, next) {
    

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user, "Login")

    return res.render("member/Login", viewModel)

  });

app.post('/member/login',

ValidationService.validateInput({
    email:"required|email",
    password:"required|minLength:6"
},{
    "email.required":"Email is required", 
    "email.email":"Invalid email",
    "password.required":"Password is required.",
    "password.minLength":"Password should be at least 6 characters long."})

,async function (req, res, next) {
    const role_id = 2
    const {email, password} = req.body;

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user,"Login")

    ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        'member/Login',
        'login_fields',
        { email },
      );

try {
    const { credential, user } = await AuthService.login(email, password, role_id);


    

    const session = req.session;

    
    
    
        if (req.body.remember_me === 'on') {
          const day = 60 * 60 * 1000 * 24;
          req.session.cookie.expires = new Date(Date.now() + day * 31);
          req.session.cookie.maxAge = day * 31;
        }

    session.role = role_id
    session.user = user
    session.credential = credential

    

    return session.save((error) => {
        if(error){
            throw new Error(error);
        }
        return res.redirect("/member/dashboard")
    })
    

} catch (error) {
    viewModel.error = error.message ||  "Something went wrong";
    viewModel.login_fields.email = email;
    return res.render("member/Login",viewModel )
    
}

  });

module.exports = app;

