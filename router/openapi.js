'use strict';

const moment  = require('moment-timezone');
const router  = require('.');
const lib     = require('../lib');

module.exports = function(app) {

  app.post('/check-in/', function (req, res) {
    var name = req.body.Name;
    var uid  = req.body.Uid;
    var rcn  = req.body.Rcn;
    var mac  = req.body.Mac;
    var token = lib.utils.generatekey('none',32);
    console.log(name, mac, token);
    var result = lib.mysql.getLicenseWithUid([uid]);
    if (result == undefined) {
      lib.mysql.putLicense ([name, uid, rcn, mac, token]);
      result = lib.mysql.getLicenseWithMac([mac]);
    }
    res.json(result)
  });

  app.post('/heartbeat/', function (req, res) {
    res.json({});
  });

  app.get('/receipt/:uid/:rno', function (req, res) {
    var uid = req.params.uid;
    var rno = req.params.rno;
    var ret = lib.mysql.findReceipt([uid, rno]);
    if (ret != undefined) { res.json({code:200, data:ret}) }
    else { res.json({code:404}) };
  });

  app.get('/generate/:uid/:rno', function (req, res) {
    var uid = req.params.uid;
    var rno = req.params.rno;
    lib.utils.postJSON(`/receipt/probe/${uid}`, {Data:lib.utils.genReceiptBody1(rno)});
    res.json({})
  });

};
