'use strict';

const ValidationService = require('../../services/ValidationService')
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const db = require("../../models");
const app = require('express').Router();

const role_id = 2

app.get('/member/forgot',
SessionService.preventAuthRoutes(role_id, 'member')
,async function (req, res, next) {
    

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new  AuthViewModel(db.user, "Forgot Password")

    return res.render("member/Forgot", viewModel)

  });

app.post('/member/forgot',

ValidationService.validateInput({
    email:"required|email",
},{
    "email.required":"Email is required", 
    "email.email":"Invalid email",
})
,async function (req, res, next) {
    const role_id = 2
    const {email} = req.body;

    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user,"Forgot Password")

   
      ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        'member/Forgot',
        'forgot_fields',
        { email },
      );


try {
    const accountExists  = await  viewModel.account_exists(email,{role_id})
    if(!accountExists){
        viewModel.error = "Account doesn't exists."
        return res.render("member/Forgot",viewModel )
    }
    
    const user = await  viewModel.get_associated_user(accountExists.user_id)

    if(!user){
        viewModel.error = "Account doesn't exists."
        return res.render("member/Forgot",viewModel )
    }
    
    viewModel.initializeMailService(email)
    const mailTemplate = await viewModel.getForgotPasswordMailTemplate('reset-password')

    if (!mailTemplate) {
        throw new Error();
      }

    const token = viewModel.generateRandomToken()

    if (!token) {
        throw new Error();
      }


    const finalTemplate = viewModel.injectMailTemplate(
        {
            body: mailTemplate.html,
            subject: mailTemplate.subject,
          },
          {
            email,
            link: process.env.BASE_URL + '/member/reset',
            reset_token: token,
          },
    )

    if (!finalTemplate) {
        throw new Error();
      }

     await viewModel.saveTokenToDB(token, user.id)

     await viewModel.sendMail(finalTemplate)

     viewModel.success = "A password reset link is sent to your inbox."
     return res.render("member/Login", viewModel)

} catch (error) {
    viewModel.error = "Something went wrong"
    return res.render("member/Forgot",viewModel )
    
}
});


app.get('/member/reset/:token',
SessionService.preventAuthRoutes(role_id, 'member')
, async function (req, res, next) {
    
    const token = req.params.token
    if(!token){
        viewModel.error = "Invalid token"
        return res.render("member/Login",viewModel)
    }
    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user, "Reset Password")

    viewModel.resetToken=token



    try {
        const tokenValid = await viewModel.validateToken(token)
        if(!tokenValid){
            viewModel.error = "Invalid token"
            return res.render("member/Login",viewModel)
        }
        return res.render("member/Reset", viewModel)

    } catch (error) {
        viewModel.error = "Something went wrong"
        return res.render("member/Login",viewModel )
    
    }

  });

  app.post('/member/reset/:token',

ValidationService.validateInput({
    password:"required|minLength:6",
    confirm_password:"required|minLength:6",
},{
    "password.required":"Password is required.",
    "confirm_password.required":"Password is required.",
    "password.minLength":"Password should be at least 6 characters long.",
    "confirm_password.minLength":"Password should be at least 6 characters long."
    })
,async function (req, res, next) {
    const role_id = 2
    const token = req.params.token
    const {password, confirm_password} = req.body;

    if(!token){
        viewModel.error = "Invalid token"
        return res.render("member/Login",viewModel)
    }

    if(password!==confirm_password){
        viewModel.error = "Passwords do not match"
        return res.render("member/Reset",viewModel )
    }
    const AuthViewModel = require("../../view_models/member_auth_view_model")

    const viewModel =new AuthViewModel(db.user,"Reset Password")
    viewModel.resetToken = token;



    ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        'member/Reset',
        'reset_fields',
        { password, confirm_password },
      );



try {
    const tokenValid = await viewModel.validateToken(token)
    if(!tokenValid){
        viewModel.error = "Invalid token"
        return res.render("member/Login",viewModel)
    }

    const hashPassword =await  viewModel.generate_hash(password)
    if(!hashPassword){
        throw new Error()
    }
    const userCredential =await  viewModel.getUserCredential(tokenValid.user_id)
    
    if(!userCredential){
        throw new Error()
    }
    await viewModel.updatePassword(hashPassword, userCredential.id)

    viewModel.success="Password reset successful"
    return res.render("member/Login",viewModel)

   
} catch (error) {
    viewModel.error = error.message ||  "Something went wrong";
    return res.render("member/Reset",viewModel )
    
}
});

module.exports = app;

