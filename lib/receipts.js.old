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
        //data = lib.utils.remove_non_ascii(data);
        //const detectCharacterEncoding = require('detect-character-encoding');
        //const charsetMatch = detectCharacterEncoding(Buffer.from(data));
        //console.log(charsetMatch);

        // Find Receipt Format
        if(data.indexOf('☞ 도 서 위 치 ☜') < 0 
            && data.indexOf('재  고 :') < 0
            && data.indexOf('주 문 서 (주방') < 0) {
          console.log(`txt/${rcn}.${out}.txt`);
          lib.utils.write(`esc/${rcn}.${out}.esc`, escp);
          lib.utils.write(`txt/${rcn}.${out}.txt`, data);

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
              for(var i=0; i< lists.length; i++) {
                console.log("TITLE:", lists[i].title, "ISBN:", lists[i].isbn, "QTY:", lists[i].qty, "UNIT:", lists[i].unit, "PRICE:", lists[i].price);
                lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, lists[i].title, lists[i].isbn, lists[i].qty, lists[i].unit, lists[i].price]);
              }

              /*
              if (parsed.count == undefined) parsed.count = 0;
              parsed.rno   = parsed.rno.split(' ')[0];
              parsed.total = parsed.total.split(' ')[0];
              var items  = parsed.items.split(' ');
              var result = lib.mysql.getLicenseWithUid([uid]);
              console.log (result);
              console.log("COUNT:", parsed.count, "TOTAL:",parsed.total, "RNO:",parsed.rno, "#:", items.length, "ITEMS:",items);
              console.log("==================================================================");

              //lib.mysql.putReceipt ([uid, parsed.rno, name, rcn, escp, data, parsed.items]);
              var nrow = 0;
              var ncol = 0;
              switch (rcn) {
              case "402-91-74980": // 웅진
              case "418-05-55695": // 웅진서적(효자점)
              case "180-30-00939": // 청동북카페
              case "418-05-56622": // 북닷컴&세종문고
              case "167-65-00224": // 소소당
              case "402-91-24375": // 민중서관
              case "281-08-01337": // 전북서적
                ncol = 4;
                nrow = items.length/ncol;
                for (var i=0; i<nrow; i++) {
                  lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, items[i*ncol+0].replace(/[,*@]/g,''), items[i*ncol+1].replace(/[,*@]/g,''),items[i*ncol+3].replace(/[,*@]/g,''),items[i*ncol+2].replace(/[,*@]/g,''),items[i*ncol+3].replace(/[,*@]/g,'')]);
                }
                break;
              case "418-90-32548": // 홍지서림(아중점)
              case "418-90-33246": // 홍지서림(송천점)
              case "402-91-62194": // 홍지서림(효자점)
              case "402-91-61986": // 홍지서림(본점)
              case "402-91-18062": // 일도문고
              case "325-65-00422": // 고래의꿈
                ncol = 5;
                nrow = items.length/ncol;
                for (var i=0; i<nrow; i++) {
                  lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, items[i*ncol+0].replace(/[,*@]/g,''), items[i*ncol+1].replace(/[,*@]/g,''),items[i*ncol+2].replace(/[,*@]/g,''),items[i*ncol+3].replace(/[,*@]/g,''),items[i*ncol+4].replace(/[,*@]/g,'')]);
                }
                break;
              case "107-96-10480": // 문필서림
              case "402-91-41622": // 호남문고(서신점)
              case "402-90-24465": // 호남문고(인후점)
              case "402-91-85412": // 월림문고
                ncol = 6;
                nrow = items.length/ncol;
                for (var i=0; i<nrow; i++) {
                  lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, items[i*ncol+1].replace(/[,*@]/g,''), items[i*ncol+2].replace(/[,*@]/g,''),items[i*ncol+4].replace(/[,*@]/g,''),items[i*ncol+3].replace(/[,*@]/g,''),items[i*ncol+5].replace(/[,*@]/g,'')]);
                }
                break;
              case "402-98-44934": // 중앙서림
              case "402-90-56813": // 신 문광서림
              case "382-44-00717": // 서울서점
              case "402-90-67800": // 세종문고
                ncol = 6;
                nrow = items.length/ncol;
                for (var i=0; i<nrow; i++) {
                  lib.mysql.putBook ([parsed.rno, uid, result.name, result.rcn, `${rcn}.${out}`, items[i*ncol+1].replace(/[,*@]/g,''), items[i*ncol+2].replace(/[,*@]/g,''),items[i*ncol+3].replace(/[,*@]/g,''),items[i*ncol+4].replace(/[,*@]/g,''),items[i*ncol+5].replace(/[,*@]/g,'')]);
                }
                break;
              }
              */
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
};
