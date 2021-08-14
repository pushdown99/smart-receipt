'use strict';

const moment  = require('moment-timezone');
const router  = require('.');
const lib     = require('../lib');
const server  = "https://smart.hancomlifecare.com"

let nance = 0;

module.exports = function(app) {

  app.get('/audit/', function (req, res) {
    res.render('audit');
  });

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
    var name = req.body.Name;
    var uid  = req.body.Uid;
    var rcn  = req.body.Rcn;
    var mac  = req.body.Mac;

    nance += 1
    var result = lib.mysql.getAuditWithRcnUidMac([rcn, uid, mac]);
    if (result == undefined) {
      lib.mysql.putAudit ([name, uid, rcn, mac, nance]);
    }
    else {
      lib.mysql.updAudit ([nance, rcn, uid, mac]);
    }

    res.json({});
  });

  app.get('/receipt/uid/:uid/:rno', function (req, res) {
    var uid = req.params.uid;
    var rno = req.params.rno;
    var ret = lib.mysql.findReceiptUidRno([uid, rno]);
    ret.items = JSON.parse(ret.items);
    ret.registered = moment(ret.registered).format("YYYY-MM-DD HH:mm:ss");
    ret.pdf = server +"/pdf/"+ret.fname+".pdf";
    ret.txt = server +"/txt/"+ret.fname+".txt";
    ret.esc = server +"/esc/"+ret.fname+".esc";
    console.log(ret.items);
    if (ret != undefined) { res.json({code:200, data:ret}) }
    else { res.json({code:404}) };
  });

  app.get('/receipt/rcn/:rcn/:rno', function (req, res) {
    var rcn = req.params.rcn;
    var rno = req.params.rno;
    var ret = lib.mysql.findReceiptRcnRno([rcn, rno]);
    ret.items = JSON.parse(ret.items);
    ret.registered = moment(ret.registered).format("YYYY-MM-DD HH:mm:ss");
    ret.pdf = server +"/pdf/"+ret.fname+".pdf";
    ret.txt = server +"/txt/"+ret.fname+".txt";
    ret.esc = server +"/esc/"+ret.fname+".esc";
    console.log(ret.items);
    if (ret != undefined) { res.json({code:200, data:ret}) }
    else { res.json({code:404}) };
  });

  app.get('/receipt/list/:limit', function (req, res) {
    var num = parseInt(req.params.limit);
    var ret = lib.mysql.getReceipt([num]);
    if (ret != undefined) {
      for (var i=0;i<ret.length;i++) {
        ret[i].items = JSON.parse(ret[i].items);
        ret[i].registered = moment(ret[i].registered).format("YYYY-MM-DD HH:mm:ss");
        ret[i].pdf = server +"/pdf/"+ret[i].fname+".pdf";
        ret[i].txt = server +"/txt/"+ret[i].fname+".txt";
        ret[i].esc = server +"/esc/"+ret[i].fname+".esc";
      }
      res.json({code:200, data:ret});
    }
  });

  app.get('/receipt/list/:rcn/:limit', function (req, res) {
    var num = parseInt(req.params.limit);
    var rcn = parseInt(req.params.rcn);
    var ret = lib.mysql.getReceiptRcn([rcn, num]);
    if (ret != undefined) {
      for (var i=0;i<ret.length;i++) {
        ret[i].items = JSON.parse(ret[i].items);
        ret[i].registered = moment(ret[i].registered).format("YYYY-MM-DD HH:mm:ss");
        ret[i].pdf = server +"/pdf/"+ret[i].fname+".pdf";
        ret[i].txt = server +"/txt/"+ret[i].fname+".txt";
        ret[i].esc = server +"/esc/"+ret[i].fname+".esc";
      }
      res.json({code:200, data:ret});
    }
  });
};
