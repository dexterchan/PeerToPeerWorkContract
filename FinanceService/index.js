const express=require("express");
const cors = require('cors')
const Helmet=require('helmet');
const Morgan = require('morgan');
const config = require("config");
const systemLogger = require("debug")("app:sys");
const app=express();

const eCashOrder_router=require("./routes/eCashOrder");

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production"){
    /*
    const swaggerUi = require('swagger-ui-express'),
        swaggerDocument = require('./swagger.json');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    */
}
app.use("/api/ecashorder",eCashOrder_router);
/*
app.get("/",(req,res)=>{
    res.send("Hello world!!!");
});*/
if (process.env.NODE_ENV === "production"){
    app.use(Helmet());
    systemLogger("Production loading Helmet...");
    app.use(Morgan("common"));
    console.log("Production writing log");
}else{
    systemLogger("development loading...");
}

//PORT
const port=process.env.PORT || 8001
systemLogger("Started app");
app.listen(port,()=>console.log(`Listening on port: ${port}...`));