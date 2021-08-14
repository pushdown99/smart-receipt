'use strict';

const upload  = require('express-fileupload');

module.exports = function(app) {
  app.use(upload());

  app.get('/upload', function(req, res) {
    res.render('upload');
  });

  app.post('/upload', function(req, res) {
    let sampleFile, uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    console.log('req.files >>>', req.files); // eslint-disable-line
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../data/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err) {
      if (err) { return res.status(500).send(err); }
      res.send('File uploaded to ' + uploadPath);
    });
  });

  app.get('/data/:f', (req, res) => {
    let f = req.params.f;
    let d = 'data';
    let p = `${d}/${f}`;
    res.download (p);
  });
}

