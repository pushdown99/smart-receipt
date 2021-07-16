'use strict';

let dotenv = require('dotenv').config({ path: require('find-config')('.env') })
let moment = require('moment-timezone');
let lib    = require('.');

let map = new Map();

function checkItems(rcn, items) {
  var list = items.replace(/[0-9]+\. /g,'')
  list  = list.replace(/[,*@]/g,'')
  list  = list.split(' ');
  console.log("checkItems", rcn, list);

  var books = [];
  for (var offset=0; offset<list.length;) {
    var book = {};

    if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+2])) && isNaN(parseInt(list[offset+3])) && isNaN(parseInt(list[offset+4]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]+" "+list[offset+4]; offset += 5; console.log("1", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+3])) && isNaN(parseInt(list[offset+4]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]+" "+list[offset+4]; offset += 5; console.log("2", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+2])) && isNaN(parseInt(list[offset+4]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]+" "+list[offset+4]; offset += 5; console.log("3", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+3])) && isNaN(parseInt(list[offset+4]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]+" "+list[offset+4]; offset += 5; console.log("4", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+2])) && isNaN(parseInt(list[offset+3]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]; offset += 4; console.log("5", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+3]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]+" "+list[offset+3]; offset += 4; console.log("6", book["title"]);}
    else if(isNaN(parseInt(list[offset+1])) && isNaN(parseInt(list[offset+2]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]; offset += 3; console.log("6", book["title"]);}
    else if(isNaN(parseInt(list[offset+2]))) { book["title"]=list[offset]+" "+list[offset+1]+" "+list[offset+2]; offset += 3; console.log("6", book["title"]);}
    else if(isNaN(parseInt(list[offset+1]))) { book["title"]=list[offset]+" "+list[offset+1]; offset += 2; console.log("7", book["title"]);}
    else { book["title"]=list[offset]; offset += 1; }

    if (list[offset].length >= 10) {
      book["isbn"]  = list[offset].substring(0,13);
      offset += 1;
    }
    else {
      book["isbn"]  = "0000000000000";
    }
    if(parseInt(list[offset]) > parseInt(list[offset+1])) {
      book["qty"]  = parseInt(list[offset+1]);
      book["unit"] = parseInt(list[offset+0]);
    }
    else {
      book["qty"]  = parseInt(list[offset+0]);
      book["unit"] = parseInt(list[offset+1]);
    }
    if (isNaN(parseInt(list[offset+2]))) {
      book["price"] = parseInt(list[offset+1]);
      book["unit"]  = book["price"]/book["qty"];
      offset += 2;
    }
    else {
      book["price"] = parseInt(list[offset+2]);
      offset += 3;
    }

    books.push(book);
  }
  console.log(books);
  return books;
}

module.exports = function(app) {
  var fs = require('fs');
  var stream = fs.createWriteStream("/tmp/parser.txt");

  app.post('/receipt/probe/:uid', function (req, res) {
    var uid   = req.params.uid;
    var ret  = lib.mysql.getLicenseWithUid([uid]);
    var name = ret.name;
    var rcn  = ret.rcn;
    var out  = moment().format('YYYYMMDDHHmmss');
    var escp = req.body.Data;

    //var t = lib.escp(escp);
    //console.log(t);

    var buff = Buffer.from (escp, 'hex');
    var prev = map.get(uid);

    if (prev != undefined) escp = prev + escp

    switch (buff[0]) {
    case 0x0: 
    case 0x1: 
    case 0x2: 
    case 0x3: 
    case 0x4: 
    case 0x5: 
    case 0x6: 
    case 0x7: 
    case 0x8: 
      map.delete(uid);
      break;

    default:
      if (escp.indexOf("1b6d") < 0 
          && escp.indexOf("1b69") < 0 
          && escp.indexOf("202020202020202020202020202020202020202020202020202020202020202020202020202020200d0a") < 0
          && escp.indexOf("1d56") < 0) {

        console.log("### NO PAPERCUT");
        map.set(uid, escp);
        console.log("Cur Data: ", escp);
      }
      else {
        map.delete(uid);
        console.log("Handle Data: ", escp);
        // paper cut
        escp = escp.replace("202020202020202020202020202020202020202020202020202020202020202020202020202020200d0a","1b6d");
        console.log (escp);
        var data = lib.escp(escp); // ESC/P decode

        // Find Receipt Format
        if(data.indexOf('☞ 도 서 위 치 ☜') < 0 
            && data.indexOf('재  고 :') < 0
            && data.indexOf('주 문 서 (주방') < 0) {
          console.log(`txt/${rcn}.${out}.txt`);
          lib.utils.write(`esc/${rcn}.${out}.esc`, escp);
          lib.utils.write(`txt/${rcn}.${out}.txt`, data);
          lib.pdf        (`pdf/${rcn}.${out}.pdf`, data);

          lib.parser (data, function (err, parsed) {
            if (parsed != undefined) {
              console.log("PARSER FOUND");
              console.log("==================================================================");
              //console.log(parsed);
              var lists = checkItems(rcn, parsed.items);
              console.log ("LISTS: ", lists.length);
              var result = lib.mysql.getLicenseWithUid([uid]);
              parsed.rno   = parsed.rno.split(' ')[0];
              parsed.total = parsed.total.split(' ')[0];

              lib.mysql.putReceipt ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, JSON.stringify(lists)]);
              for(var i=0; i< lists.length; i++) {
                console.log("TITLE:", lists[i].title, "ISBN:", lists[i].isbn, "QTY:", lists[i].qty, "UNIT:", lists[i].unit, "PRICE:", lists[i].price);
                lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, lists[i].title, lists[i].isbn, lists[i].qty, lists[i].unit, lists[i].price]);
              }
            }
            else {
              console.log("FINDING PARSER FAIL:");
              console.log (escp);
            }
          });
        }
        else {
          console.log (data);
        }
      }
    }
    res.json({});
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // File download & viewer
  //
  app.get('/pdf/:f', (req, res) => {
    let f = req.params.f;
    let d = 'pdf';
    let p = `${d}/${f}`;
    let data = require('fs').readFileSync(p);
    res.contentType("application/pdf");
    res.send (data);
  });

  app.get('/txt/:f', (req, res) => {
    let f = req.params.f;
    let d = 'txt';
    let p = `${d}/${f}`;
    let data = require('fs').readFileSync(p);
    res.contentType("text/html");
    res.send (data);
  });

  app.get('/esc/:f', (req, res) => {
    let f = req.params.f;
    let d = 'esc';
    let p = `${d}/${f}`;
    let data = require('fs').readFileSync(p);
    res.contentType("text/html");
    res.send (data);
  });
};
