const inf  = '/root/smart-receipt/txt';
const outf = '/root/smart-receipt/htm';
const fs = require('fs');

fs.readdir(inf, (err, files) => {
  files.forEach(f => {
    var data = fs.readFileSync(inf + '/' + f, 'utf8')
    data = data.replace(/\n/gi,'</br>');

    out = f.replace(/.txt/gi, '.htm');
    fs.writeFileSync(outf + '/' + out, data);
    //fs.writeFileSync(outf + '/' + f, data);
  });
});
