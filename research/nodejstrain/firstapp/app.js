
const path=require("path");
const os=require("os");

const fs = require("fs");

const Logger=require("./logger");
const eventDemo = require("./eventdemo");

var msg="hello";

var sayHello= (name)=>{
    console.log("Hello," + name);
};

sayHello("蛋蛋");

Logger.logFunc("hihi,蛋蛋");

var pathObj=path.parse(__filename);
console.log(pathObj);

var totalMemory=os.totalmem();
var freeMemory=os.freemem();
//console.log("Total Memory:"+totalMemory);
//Template String
//ES6 /ES2015: ECMAScript 6
console.log(`Total Memory:${totalMemory}`);
console.log(`Free Memory:${freeMemory}`);


const files=fs.readdirSync("./");
console.log("Read Sync:",files);

//Always prefer using async to fully use the feature of node.js
fs.readdir("./",(err,files)=>{
    if(err) console.log("Error",err);
    else{
        console.log("Read async Result",files);
    }
});

eventDemo.testClass("hihi, 蛋蛋 from class");


const httptest=require("./httptest");
httptest(3000);
