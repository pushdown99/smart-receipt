'use strict';

const ESC       =  27;  // escape code
const GS        =  29;  // escape code
const RESET     =  64;
const BOLD      =  69;
const UNDERLINE =  45;
const ALIGN     =  97;
const POINT     =  77;
const FONTATTR  =  38;
const COLOR     = 114;
const PAPERCUT  =  29;

module.exports = function (data) {
  let iconv = require('iconv-lite');
  let buf = [];

  data = Buffer.from(data, 'hex');

  for(var index = 0; index < data.length; index++) {
    switch(data[index]) {
    case GS:
      console.log('[GS]', data[index+1].toString(16), data[index+1]);
      switch (data[++index]) {
      case 42 :
      case 47 :
      case 58 :
      case 66 :
      case 72 :
      default:
        index += 1; break;
      }
      break;
    case ESC:
      console.log('[ESC]', data[index+1].toString(16), data[index+1]);
      switch (data[++index]) {
      case 64 :
      case 33 :
      case 45 :
      case 69 :
      case 77 :
      case 97 :
      case 100:
      case 105:
      case 114:
      default:
        index += 1; break;
      case 29:
        index += 2; break;
      }
      break;

    default:
      if(data[index] >= 32)      buf.push(data[index]);
      else if(data[index] == 10) buf.push(data[index]);
      else if(data[index] == 13) buf.push(data[index]);
      else                       buf.push(data[index]);
    }
  }
  return iconv.decode(Buffer.from(buf), 'euc-kr').toUpperCase();
}

