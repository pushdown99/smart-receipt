'use strict';

let dotenv = require('dotenv').config({ path: require('find-config')('.env') })
let fs     = require('fs');
let http   = require('http');
let https  = require('https');

let port_http  = process.env.PORT_HTTP  || 80;
let port_https = process.env.PORT_HTTPS || 443; // 55100

let pem_privateKey  = process.env.PEM_PRIVATEKEY || '/root/receipt/ssl/privkey.pem';
let pem_certificate = process.env.PEM_CERT       || '/root/receipt/ssl/cert.pem'   ;
let pem_ca          = process.env.PEM_CHAIN      || '/root/receipt/ssl/chain.pem'  ;

module.exports = {
  listen: function(app) {
    const privateKey  = fs.readFileSync(pem_privateKey, 'utf8');
    const certificate = fs.readFileSync(pem_certificate, 'utf8');
    const ca          = fs.readFileSync(pem_ca, 'utf8');
    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };
    const httpServer  = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(port_http, () => {
      console.log('Listener: ', 'http  listening on port ' + port_http);
    });

    httpsServer.listen(port_https, () => {
      console.log('Listener: ', 'https listening on port ' + port_https);
    });
  }
}
