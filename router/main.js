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
  let lib     = require('../lib');
  let router  = require('.');
  let cron    = require('node-cron');
  let verbose = true;

  app.get('/', function (req, res, next) {
    res.send("Hi, There?");
  });

  return app;
};
 

