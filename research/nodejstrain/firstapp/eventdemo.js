const EventEmitter=require("events");

const emitter = new EventEmitter();
const Logger=require("./logger");

var testEvent = (msg)=>{
    //emitter.addListener();
    emitter.on("messageLogged",(eventArg)=>{
        console.log("Event Demo Listener called",eventArg);
    });
    //Raise an event moved to logger now
    emitter.emit("messageLogged",{id:1, url:msg});
};


var testEventWithEmitterClass = (msg) =>{
    const myLogger=new Logger.LogClass();
    myLogger.on("messageLogged",(eventArg)=>{
        console.log("Event Demo Listener called",eventArg);
    }); 
    myLogger.log(msg);

};
//const log = require("./logger");
//log("send event");

module.exports.testFunc=testEvent;
module.exports.testClass = testEventWithEmitterClass;