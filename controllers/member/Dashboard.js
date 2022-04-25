const SessionService = require('../../services/SessionService');
const app = require('express').Router();

const role = 2;

app.get(
    "/member/dashboard",
    SessionService.verifySessionMiddleware(role,"member"),
    async function (req, res, next) {

      res.render('member/Dashboard',{
        get_page_name: () => 'Dashboard',
        _base_url: '/member/dashboard',
      });
    }
  );
  
module.exports = app;