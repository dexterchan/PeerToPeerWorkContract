const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/config");
const systemLogger = require("debug")("app:sys");
require("./startup/routes")(app);
require("./startup/prod");

/*
if (process.env.NODE_ENV !== "production"){
    
    const swaggerUi = require('swagger-ui-express'),
        swaggerDocument = require('./swagger.json');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
}  */

//PORT
const port = process.env.PORT || 8001;
systemLogger("Started app");
const server = app.listen(port, () =>
  console.log(`Listening on port: ${port}...`)
);
module.exports = server;
