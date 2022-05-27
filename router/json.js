'use strict';

module.exports = function (app) {
  let moment  = require('moment-timezone');
  let isbn    = require('node-isbn');
  let dotenv  = require('dotenv').config({ path: require('find-config')('.env') })
  let lib     = require('../lib');
  let router  = require('.');

  app.get('/json/audit', function (req, res) {
    var result = lib.mysql.getAudit ([]);
    res.json (result);
  });

  ///////////////////////////////////////////////////

  app.get('/bookstore', function(req, res){
    var result = lib.mysql.getStoreList([]);
    res.send(JSON.stringify(result));
  });

  app.get('/books', function(req, res){
    var result = lib.mysql.getBooks([]);
    res.send(JSON.stringify(result));
  });
  app.get('/receipt/list', function(req, res){
    var result = lib.mysql.getReceipt([1000]);
    res.send(JSON.stringify(result));
  });

  app.get('/today-book', function(req, res){
    var result = lib.mysql.getBookToday([]);
    res.send(JSON.stringify(result));
  });

  app.get('/today-receipt', function(req, res){
    var result = lib.mysql.getReceiptToday([]);
    res.send(JSON.stringify(result));
  });

  app.get('/today-sales', function(req, res){
    var result = lib.mysql.getSalesToday([]);
    res.send(JSON.stringify(result));
  });

  app.get('/isbn/:no', function(req, res){
    var no = req.params.no;
    isbn.resolve(no, function (err, book) {
      if (err) {
        console.log('Book not found', err);
      } else {
        console.log('Book found %j', book);
        res.redirect(book.infoLink);
      }
    });
  });

}
