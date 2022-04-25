const OAuthService = require('../../services/OAuthService');
const JWTService = require('../../services/JwtService');
const AuthService = require('../../services/AuthService');
const ValidationService = require('../../services/ValidationService');
const db = require('../../models');
const app = require('express').Router();
// prettier-ignore


app.get('/member/google/initialize', async function (req, res) {
  const role_id = 2
try {
 
  
  const authenticationUrl = OAuthService.google.generateAuthURL({
    redirect_uri: process.env.DYNAMIC_CONFIG_GOOGLE_REDIRECT_URI, 
    client_id: process.env.DYNAMIC_CONFIG_GOOGLE_CLIENT_ID,
  });

  res.redirect(authenticationUrl)
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
});

app.get('/member/google', async function (req, res) {
try {
  const role_id = 2
 
  const AuthViewModel = require('../../view_models/member_auth_view_model');
  var viewModel = new AuthViewModel(db.user, 'Google login');
  
  const authToken = await OAuthService.google.generateAuthToken({
    redirect_uri: process.env.DYNAMIC_CONFIG_GOOGLE_REDIRECT_URI, 
    client_id: process.env.DYNAMIC_CONFIG_GOOGLE_CLIENT_ID,
    client_secret: process.env.DYNAMIC_CONFIG_GOOGLE_CLIENT_SECRET,
    auth_code: req.query.code,
  });

  const googleUser = await OAuthService.google.getUserInfo(authToken);

  const payload = await OAuthService.authenticate({
    provider: 'g',
    id: googleUser.id,
    email: googleUser.email,
    first_name: googleUser.given_name,
    last_name: googleUser.family_name,
    image: googleUser.picture,
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