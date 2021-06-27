'use strict';

const https   = require('https')
const rand    = require("random-key");
const random  = require("random");
const fs      = require('fs');
const mail    = require('nodemailer');
const crypto  = require('crypto');
const bcrypt  = require('bcrypt');
const request = require('request');
const fcm     = require('fcm-node');
const path    = require('path');
const winston = require('winston');
const moment  = require('moment-timezone');
const iconv   = require('iconv-lite');

module.exports = {

  generatekey: function(type = 'none', length = 32) {
    switch(type) {
    case 'none'  : return rand.generate(length);
    case 'base30': return rand.generateBase30(length);
    case 'digits': return rand.generateDigits(length);
    }
  },

  postJSON: function (url, json) {
    let axios  = require('axios');

    return new Promise((resolve, reject) => {
      axios.post(url, json).catch(err => resolve()).then(data => resolve(data))
    });
  },

  getJSON: function (url, json) {
    let axios  = require('axios');

    return new Promise((resolve, reject) => {
      axios.get(url, json).catch(err => resolve()).then(data => resolve(data))
    });
  },

  read: function(f) {
    return fs.readFileSync(f);
  },

  write: function(f, data) {
    fs.writeFile(f, data, function (err) {
      if (err) console.log (err);
    });
  },

  genReceiptBody: function() {
    let t = moment().format("YYYY-MM-DD HH:mm:ss");
    let message = "";
    message += `스타벅스 전주한옥마을점                   \n`;
    message += `대표:송데이비드호섭 201-81-21515 1522-3232\n`;
    message += `주소: 전라북도 전주시 완산구 전동 187-9   \n`;
    message += `==========================================\n`;
    message += `${t}                       \n`;
    message += `==========================================\n`;
    message += `상품                   단가 수량      금액\n`;
    message += `------------------------------------------\n`;
    message += ` 카페 라떼            9,200    1     9,200\n`;
    message += `==========================================\n`;
    message += `부가세과세합계:                      8,364\n`;
    message += `부    가    세:                        836\n`;
    message += `합          계:                      9,200\n`;
    message += `------------------------------------------\n`;
    message += `카드:신한카드                        9,200\n`;
    message += `              (결제금액)             9,200\n`;
    message += `------------------------------------------\n`;
    message += `영수증을 지참하시면                       \n`;
    message += `교환/환불시 더욱 편리합니다.              \n`;

    return  iconv.encode(message, 'euc-kr').toString('hex');
  },

  genReceiptBody1: function(rno) {
    let t = moment().format("YYYY-MM-DD HH:mm:ss");
    let message = "";
    message += `일도문고(평화점)                          \n`;
    message += `------------------------------------------\n`;
    message += `등록번호:402-91-18062    대표:이경희      \n`;
    message += `전화:063-224-4793     팩스:063-224-4797   \n`;
    message += `주소: 전북 전주시 완산 평화동2가 890-5    \n`;
    message += `------------------------------------------\n`;
    message += `일자:${t}                                 \n`;
    message += `포스:1     영수증NO:${rno}                \n`;
    message += `==========================================\n`;
    message += `[상 품 명]     [정가]    [수량]   [금  액]\n`;
    message += `==========================================\n`;
    message += `백세시대민간약초보감                      \n`;
    message += `266829        18,000          1     18,000\n`;
    message += `------------------------------------------\n`;
    message += `[합    계]:                         18,000\n`;
    message += `------------------------------------------\n`;
    message += `                                          \n`;
    message += `------------------------------------------\n`;
    message += `받은금액                            18,000\n`;
    message += `거스름돈                                 0\n`;
    message += `------------------------------------------\n`;
    message += `착오구매시3일이내/파본시10일이내          \n`;
    message += `반품제외품목잡지.만화.상품권              \n`;
    message += `비닐포장훼손도서교환불가합니다내          \n`;
    message += `1년동안거래가없을시포인트소멸됩니다       \n`;

    return  iconv.encode(message, 'euc-kr').toString('hex');
  }
};
