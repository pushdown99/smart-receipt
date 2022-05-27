'use strict';

let lib         = require('../lib');
const mysql     = require('sync-mysql');
let dotenv      = require('dotenv').config({ path: require('find-config')('.env') })
let connection  = null;
let db_host     = "";
let db_user     = "";
let db_password = "";
let db_database = "";
let verbose     = false;

module.exports = {

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  connect: function(hostname, username, password, database, v) {
    db_host     = hostname;
    db_user     = username;
    db_password = password;
    db_database = database;
    verbose     = v;

    connection  = new mysql({ host:db_host, user:db_user, password:db_password, database:db_database });
    this.query("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
    this.query("SET time_zone='+9:00'");
  },

  query: function(s, v = null) {
    if(connection == null) console.log("No MySQL connection.");
    //if(verbose) console.log('db: ', s, v);
    if(v == null || v.length == 0) return connection.query(s);
    else                           return connection.query(s, v);
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  getLicenseWithMac: function(record) {
    return this.query("SELECT * FROM license WHERE mac = ?", record)[0];
  },

  getLicenseWithUid: function(record) {
    return this.query("SELECT * FROM license WHERE uid = ?", record)[0];
  },

  getLicenseWithToken: function(record) {
    return this.query("SELECT * FROM license WHERE token = ?", record)[0];
  },

  getLicenseWithName: function(record) {
    return this.query("SELECT * FROM license WHERE name = ?", record)[0];
  },

  putLicense: function(record) {
    return this.query("INSERT INTO license (name, uid, rcn, mac, token) VALUES (?, ?, ?, ?, ?)", record);
  },

  getAudit: function(record) {
    return this.query("SELECT * FROM audit", record);
  },

  getAuditWithRcnUidMac: function(record) {
    return this.query("SELECT * FROM audit WHERE rcn = ? AND uid = ? AND mac = ?", record)[0];
  },

  putAudit: function(record) {
    return this.query("INSERT INTO audit (name, uid, rcn, mac, nance) VALUES (?, ?, ?, ?, ?)", record);
  },

  updAudit: function(record) { 
    return this.query("UPDATE audit SET nance = ? WHERE rcn = ? AND uid = ? AND mac = ?", record);
  },

  findReceiptUidRno: function(record) {
    console.log(record);
    return this.query("SELECT rno, uid, cname, rcn, fname, items, registered FROM receipts WHERE uid = ? AND rno = ? order by registered DESC", record)[0];
  },
  findReceiptRcnRno: function(record) {
    console.log(record);
    return this.query("SELECT rno, uid, cname, rcn, fname, items, registered FROM receipts WHERE rcn = ? AND rno = ? order by registered DESC", record)[0];
  },
  putReceipt: function(record) {
    console.log (record);
    return this.query("INSERT INTO receipts (rno, uid, cname, rcn, fname, items) VALUES (?, ?, ?, ?, ?, ?)", record);
  },
  getReceipt:  function(record) {
    console.log (record);
    return this.query("SELECT * FROM receipts ORDER BY registered DESC LIMIT ?", record);
  },
  getReceiptRcn:  function(record) {
    console.log (record);
    return this.query("SELECT * FROM receipts WHERE rcn = ? ORDER BY registered DESC LIMIT ?", record);
  },
  putBook: function(record) {
    console.log (record);
    return this.query("INSERT INTO books (rno, uid, cname, rcn, fname, name, isbn, qty, unit, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", record);
  },

  getBooks:  function(record) {
    return this.query("SELECT * FROM books ORDER BY registered DESC LIMIT 2000", record);
  },
  getStoreList:  function(record) {
    return this.query("SELECT * FROM audit ORDER BY updated DESC", record);
  },
  getBookToday:  function(record) {
    return this.query("SELECT * FROM books WHERE DATE_FORMAT(registered,'%Y-%m-%d') = DATE_FORMAT(CURRENT_TIMESTAMP,'%Y-%m-%d')", record);
  },
  getReceiptToday:  function(record) {
    return this.query("SELECT rno, cname, fname as num FROM books WHERE DATE_FORMAT(registered,'%Y-%m-%d') = DATE_FORMAT(CURRENT_TIMESTAMP,'%Y-%m-%d') GROUP BY rno,rcn", record);
  },
  getSalesToday:  function(record) {
    return this.query("SELECT sum(price) as sales FROM books WHERE DATE_FORMAT(registered,'%Y-%m-%d') = DATE_FORMAT(CURRENT_TIMESTAMP,'%Y-%m-%d')", record);
  },
};
