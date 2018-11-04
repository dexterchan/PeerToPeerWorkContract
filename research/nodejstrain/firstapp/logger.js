const EventEmitter=require("events");
//const emitter = new EventEmitter();

//console.log(__filename);
//console.log(__dirname);
var url="http://mylogger.io/log";


var  log =(message)=>{
    //Send an http request
    console.log(message);

    //emitter.emit("messageLogged",{id:1, url:"http://message.io"});
};

class Logger extends EventEmitter{
     log (message){
        //Send an http request
        //console.log(message);
    
        this.emit("messageLogged",{id:1, url:message});
    }
}

module.exports.logFunc = log;
module.exports.LogClass=Logger;
//module.exports.endPoint=url; 