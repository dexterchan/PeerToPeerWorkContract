const _=require("underscore");
const fs = require("fs");

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

name="egg";
var cert = fs.readFileSync(`keys/${name}.certificate.pem`);
var privateKey=fs.readFileSync(`keys/${name}.privkey.pem`);
//console.log(cert.toString());

cert = cert.toString();
privateKey=privateKey.toString();

//console.log(cert);

var sha256 = crypto.createHash('sha1');

const stream = fs.createReadStream("./data/SampleMessage.txt");
//stream.pipe(sha256).on("finish",()=>{this.read() });
//console.log(sha256.digest("hex"));
//sha256.end();
var msgContent;

fs.readFile("./data/SampleMessage.txt",(err,data)=>{
    if(err) {print("Error")}
    else{
      newsha256 = crypto.createHash('sha1');
      msgContent= data.toString();
      newsha256.update(msgContent);
      console.log(msgContent.toString());
      console.log(newsha256.digest("hex"));
      newsha256.end();
    }
});





