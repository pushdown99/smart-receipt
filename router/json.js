'use strict';

module.exports = function (app) {
  let moment  = require('moment-timezone');
  let dotenv  = require('dotenv').config({ path: require('find-config')('.env') })
  let lib     = require('../lib');
  let router  = require('.');

  app.get('/json/audit', function (req, res) {
    var result = lib.mysql.getAudit ([]);
    res.json (result);
  });
}
