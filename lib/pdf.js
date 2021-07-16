'use strict';

module.exports = function(f, data) {
  const fs  = require('fs');
  const pdf = require('pdfkit');

  var lines = data.split(/\r\n|\r|\n/).length;

  let doc = new pdf({
    size: [224, 600],
    margins : { top: 10, bottom:10, left: 10, right: 10 }
  });
  var out = fs.createWriteStream(f);
  doc.pipe(out);
  doc
    .font('fonts/NanumGothicCoding.ttf')
    .fontSize(9)
    .text(data, 15, 15);
  doc.end();
}

