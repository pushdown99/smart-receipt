'use strict';

module.exports = function(data, cb = null) {
  const exec  = require('child_process').exec;
  const php    = '/usr/bin/php';
  const parser = './lib/receipt-parser.php';
  const fs = require('fs');

  if (!fs.existsSync(parser)) {
    console.log ('ERROR:', parser, 'not found', process.cwd());
  }

  console.log (`${php} ${parser} "${data}"`);
  exec(`${php} ${parser} "${data}"`, function(err, stdout, stderr) {
    if(err) return cb (err, null);
    var obj = JSON.parse(stdout);
    if(cb != null) cb (err, obj);
  });
}


