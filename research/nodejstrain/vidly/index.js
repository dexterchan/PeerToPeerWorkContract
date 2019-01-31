const express = require('express');
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/route")(app);
require("./startup/validation")();
require("./startup/db")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));


module.exports=server;
/*
const p=new Promise((resolve,reject)=>{
  reject(new Error("failure promise"));

});

p.then(()=>console.log("done"));
*/

//Logging Transport
//winston.add(winston.transports.File,{filename:"logfile.log"});
//throw new Error("throw error outside");
