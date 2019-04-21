const express = require("express");
const cors = require("cors");

module.exports = app => {
  app.use(cors());
  app.use(express.json());

  app.use("/api/customer", require("../routes/customer"));

  app.get("/", (req, res) => {
    res.send("ok");
  });
};
