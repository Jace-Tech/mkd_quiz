'use strict';
const app = require('express').Router();

app.get('/admin/logout', async function (req, res, next) {
  req.session.destroy(function(err) {
    req.session = {}
  })

  return res.redirect("/admin/login")
});


module.exports = app;
