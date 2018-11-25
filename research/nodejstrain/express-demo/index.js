const express=require("express");


const app=express();

const Helmet=require('helmet');
const Morgan = require('morgan');
const customlogger = require("./middleware/logger");
const config = require("config");

const courses_router=require("./routes/courses");
const rootpage_router=require("./routes/root");

const StartDebugger = require("debug")("app:start");
const DBDebugger = require("debug")("app:db");

console.log(`NODE_ENV:${process.env.NODE_ENV}`);
console.log(`NODE_ENV: ${app.get("env")}`);

app.set ("view engine","pug");
app.set ("views","./views");

app.use(express.json());
app.use(express.urlencoded({extended:true}));//key1=value1&key2=value2
app.use(express.static("public")); //static page
app.use("/api/courses",courses_router);
app.use("/",rootpage_router);


//Configuration
console.log("Application Name:" + config.get("name"));
console.log("mail server:" + config.get("mail.host"));
console.log("mail password:" + config.get("mail.password"));

//custom middleware
//app.use( customlogger);
if (process.env.NODE_ENV === "production"){
    app.use(Helmet());
    console.log("Production loading Helmet...");
    app.use(Morgan("common"));
    console.log("Production writing log");
}else{
    app.use(customlogger);
    console.log("Development writing simple log");
}

DBDebugger("DB connected");


//PORT
const port=process.env.PORT || 3000
StartDebugger("Started app");
app.listen(port,()=>console.log(`Listening on port: ${port}...`));