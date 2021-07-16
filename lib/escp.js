'use strict';

module.exports = function (data) {
  let iconv = require('iconv-lite');
  let util = require('util');
  let buf = [];

  data = Buffer.from(data, 'hex');

  for(var index = 0; index < data.length; index++) {
    switch(data[index]) {
    // basic control command
      case 0x0C: // FF, Print and feed paper 1 lines 
        break;
      case 0x0E: // SO, Print and paper feed to the right black bar
        break;
      case 0x0A: // LF, Line feed 
        buf.push(data[index]);
        break;
      case 0x0D: // CR, Print and carriage return
        buf.push(data[index]);
        break;
      case 0x10: // DLE, Realtime
        index += 2;
        break;
      case 0x1B: // ESC
        console.log(util.format("ESC %s", String.fromCharCode(data[index+1])), data[index+1].toString(16), data[index+1]);
        switch (data[index+1]) {
          case 0x00:
            console.log("Oops");
            index += 1; break;
          // Basic control command 
          case 0x40: // ESC @, Initialize printer 
            index += 1; break;
          case 0x4A: // ESC J n, Print and Paper Feed 
            index += 2; break;
          case 0x64: // ESC d n, Print and feed paper n lines
            index += 2; break;
          case 0x69:  // ESC i, Partial Cut
            index += 1; break;
          case 0x6d:  // ESC m, Full Cut
            index += 1; break;
          case 0x70:  // Generate pulse
            index += 4; break;

          // Character parameter set command
          case 0x21: // ESC ! n, Select character printing mode
            index += 2; break;
          case 0x4D: // ESC M n, Select character font
            index += 2; break;
          case 0x2D: // ESC - n, Specify/cancels underline mode
            index += 2; break;
          case 0x45: // ESC E n, Specify/cancel emphasized printing
            index += 2; break;
          case 0x56: // ESC V n, Specify/cancel char. 90 deg. clockwise rotation
            index += 2; break;

          // Print layout parameters set command 
          case 0x24: // ESC $ nL Nh, Specify absolute position
            index += 3; break;
          case 0x44: // ESC D n1 n2…nk NULL, Set horizontal tab position
            index += 2;
            while(data[index] != 0) { index += 1; } 
            index += 1; break;
          case 0x32: // ESC 2, Set default line spacing
            index += 1; break;
          case 0x33: // ESC 3 n, Set line feed amount
            index += 2; break;
          case 0x20: // ESC SP n, Set character right space amount 
            index += 2; break;
          case 0x61: // ESC a n, Position alignment
            index += 2; break;
          // Graphics / image print command
          case 0x2A: // ESC * m nL nH d1…dk, Specify bit image mode 
            console.log("Unknown Graphics / image print command [ESC 0x2A]");
            index += 1; break;

          // Bar code printing command
          case 0x5A: // ESC Z m n k sL sH d1…dn, Print the 2D bar code
            console.log("Unknown Bar code printing command [ESC 0x5A]");
            index += 1; break;
          // Print Chinese characters command
          case 0x72: // ESC r n, Unknown
            index += 2; break;
          case 0x74: // ESC t n, Select character code page 
            index += 2; break;
          case 0x52: // ESC R n, Select international characters 
            index += 2; break;
          default:
            console.log("Unknown ESC/POS command", util.format("ESC %s", String.fromCharCode(data[index+1])));
            index += 1;
        }
        break;

      case 0x1D: // GS
        console.log(util.format("GS %s", String.fromCharCode(data[index+1])), data[index+1].toString(16), data[index+1]);
        switch (data[index+1]) {
          // Basic control command 
          case 0x0C: // GS FF, Print and paper feed to the label gap
            index += 1; break;
          case 0x99: // GS 0x99, Read the printer status
            index += 1; break;

          // Character parameter set command
          case 0x21: // GS ! n, Select character size 
            index += 2; break;
          case 0x42: // GS B n, Specify/cancel white/black inverted printing
            index += 2; break;

          // Print layout parameters set command 
          case 0x4C: // GS L n, Set left margin
            index += 2; break;

          // Graphics / image print command
          case 0x2A: // GS * x y d1…dk, Define download bit images
            console.log("Unknown Graphics / image print command [GS 0x2A]");
            index += 1; break;
          case 0x2F: // GS / n, Print download bit images
            index += 2; break;

          case 0x56: // GS V m, Select cut mode and cut paper.
            index += 2; break;

          // Bar code printing command 
          case 0x68: // GS h n, Set bar code height
            index += 2; break;
          case 0x77: // GS w n, Set bar code horizontal size 
            index += 2; break;
          case 0x48: // GS H n, Select HRI character print position
            index += 2; break;
          case 0x66: // GS f n, Select HRI character font 
            index += 2; break;
          case 0x6B: // GS k m …, Print bar code 
            //console.log("Range:",  data[index+2]);
            //console.log("Length:", data[index+3]);
            var m = data[index+2];
            var l = data[index+3];
            index += (3); break;
          case 0x5A: // GS Z n
            index += 2; break;

          // Curve the print command 
          case 0x27: // Print curve 
            console.log("Unknown Curve the print command [GS 0x27]");
            index += 1; break;
          case 0x22: // Print character on the curve
            console.log("Unknown Curve the print command [GS 0x22]");
            index += 1; break;
        }
        break;

      case 0x1C: // FS
        console.log(util.format("FS %s", String.fromCharCode(data[index+1])), data[index+1].toString(16), data[index+1]);
        switch (data[index+1]) {
          // Print Chinese characters command
          case 0x26: // FS &, Specify Chinese character mode
            index += 1; break;
          case 0x2E: // FS ., Cancel Chinese character mode
            index += 1; break;
          case 0x55: // FS U nL nH, Print Unicode code character 
            console.log("Unknown Curve the print command [FS 0x55]");
            index += 1; break;
          case 0x70: // FS p n m, Print NV bit image
            console.log("Print NV bit image [FS 0x70]");
            index += 3; break;
          case 0x71: // FS q n [xL xH yL yH d1…dk]1…[xL xH yL yH d1…dk]n, Define NV bit image
            console.log("Define NV bit image [FS 0x71]");
            index += 1; break;
        }
        break;

      case 0x1F: // US
        console.log(util.format("US %s", String.fromCharCode(data[index+1])), data[index+1].toString(16), data[index+1]);
        switch (data[index+1]) {
          // Print Chinese characters command
          case 0x66: // US f 
            index += 1; break;
          case 0x71: // US q 
            index += 1; break;

          // Especial command
          case 0x73: // US sBrP（1F 73 42 72 50), Read the Bluetooth password
            console.log("Unknown Curve the print command [US 0x73]");
            index += 1; break;
        }
        break;

      default:
        if(data[index] != 0) {
          //console.log (String.fromCharCode(data[index]), data[index].toString(16));
          buf.push(data[index]);
        }
    }
  }
  return iconv.decode(Buffer.from(buf), 'euc-kr').toUpperCase();
}
