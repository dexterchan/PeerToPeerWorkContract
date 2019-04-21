const express = require("express");
require("./startup/prod");

const app = express();
require("./startup/routes")(app);

//PORT
const port = process.env.PORT || 9000;
const server = app.listen(port, () =>
  console.log(`Listening on port: ${port}...`)
);

module.exports = server;
