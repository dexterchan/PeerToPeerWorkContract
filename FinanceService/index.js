const express=require("express");
const cors = require('cors')
const Helmet=require('helmet');
const Morgan = require('morgan');
const config = require("config");
const systemLogger = require("debug")("app:sys");
const {error,logger} = require("./middleware/error");

process.on("uncaughtException", (ex)=>{
    logger.error(ex.message,ex);
  });
  
const app=express();

const eCashOrder_router=require("./routes/eCashOrder");

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined in env variable financeService_jwtPrivateKey');
    process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(error);

if (process.env.NODE_ENV !== "production"){
    /*
    const swaggerUi = require('swagger-ui-express'),
        swaggerDocument = require('./swagger.json');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    */
}
app.use("/api/ecashorder",eCashOrder_router);

app.get("/",(req,res)=>{
    res.send("ok");
});

app.get("/healthz",(req,res)=>{
    res.send("ok");
});
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