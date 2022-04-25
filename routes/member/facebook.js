const ValidationService = require('../../services/ValidationService');
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const OAuthService = require('../../services/OAuthService');
const db = require('../../models');
const errors = require('../../core/errors');
const app = require('express').Router();


app.get('/member/facebook/initialize', async function (req, res) {
  const role_id = 2
  try {

    const authenticationUrl = OAuthService.facebook.generateAuthURL({
      redirect_uri: process.env.DYNAMIC_CONFIG_FACEBOOK_REDIRECT_URI, 
      client_id: process.env.DYNAMIC_CONFIG_FACEBOOK_CLIENT_ID,
    });

    res.redirect(authenticationUrl);
  } catch (error) {
    viewModel.error = 'Something went wrong';
    return res.render('member/Login', viewModel);
  }
});

app.get('/member/facebook', async function (req, res) {
  const role_id = 2
 
  const AuthViewModel = require('../../view_models/member_auth_view_model');
  const viewModel = new AuthViewModel(db.user, 'Facebook login');
  try {
    const authToken = await OAuthService.facebook.generateAuthToken({
      redirect_uri: process.env.DYNAMIC_CONFIG_FACEBOOK_REDIRECT_URI,
      client_id: process.env.DYNAMIC_CONFIG_FACEBOOK_CLIENT_ID,
      client_id: process.env.DYNAMIC_CONFIG_FACEBOOK_CLIENT_ID,
      client_secret: process.env.DYNAMIC_CONFIG_FACEBOOK_CLIENT_SECRET,
      auth_code: req.query.code,
    });

    const facebookUser = await OAuthService.facebook.getUserInfo(authToken);

     // Facebook doesn't return email address sometime
        // Allow email in the list of permissions in the frontend and access token will return email as well    
        
        if (!facebookUser.email) {
          throw new Error(
            'EMAIL_ASSOCIATED_WITH_FACEBOOK_COULD_NOT_BE_FOUND',
          );
        }

    const payload = await OAuthService.authenticate({
      provider: 'f',
      id: facebookUser.id,
      email: facebookUser.email,
      first_name: facebookUser.first_name,
      last_name: facebookUser.last_name,
      image: '',
      role_id
    });

    const session = req.session;
    session.role = role_id;
    session.user = payload.user;

    return session.save((error) => {
      if (error) {
        throw new Error(error);
      }
      return res.redirect('/member/dashboard');
    });
  } catch (error) {
    viewModel.error = error.message ||  "Something went wrong";
    return res.render('member/Login', viewModel);
  }
});



module.exports = app;
