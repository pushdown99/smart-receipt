'use strict';

let lib     = require('../lib');
let router  = require('.');
let random  = require("random");
let moment  = require('moment-timezone');
let iconv   = require('iconv-lite');
let fs      = require('fs');
let csv     = require('csv-reader');
let auto    = require('autodetect-decoder-stream');

module.exports = function (app) {
  let dotenv  = require('dotenv').config({ path: require('find-config')('.env') })
  let cron    = require('node-cron');
  let verbose = true;

  lib.mysql.connect (process.env.DB_HOSTNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DATABASE, verbose);

  lib.receipts (app);
  router.openapi (app);

  /*
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
        err.status = 404;
          next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  */
  
  return app;
};
 

