'use strict';

let dotenv = require('dotenv').config({ path: require('find-config')('.env') })
let moment = require('moment-timezone');
let lib    = require('.');

module.exports = function(app) {

  app.post('/receipt/probe/:uid', function (req, res) {
    var uid   = req.params.uid;
    console.log("uid:", uid);

    var ret  = lib.mysql.getLicenseWithUid([uid]);
    var name = ret.name;
    var rcn  = ret.rcn;
    var out  = moment().format('YYYYMMDDHHmmss');
    var escp = req.body.Data;
    var data = lib.escp(escp); // ESC/P decode

    lib.utils.write(`esc/${out}.esc`, escp);
    lib.utils.write(`txt/${out}.txt`, data);

    lib.parser (data, function (err, parsed) {
      if (parsed != undefined) {
        lib.mysql.putReceipt ([uid, parsed.rno, name, rcn, escp, data, parsed.items]);
      }
    });
    res.json({});
  });

};
