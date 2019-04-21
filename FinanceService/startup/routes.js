const express = require("express");
const cors = require("cors");
const eCashOrder_router = require("../routes/eCashOrder");
const auth = require("../routes/auth");
const customer = require("../routes/customer");
const { error } = require("../middleware/error");

module.exports = app => {
  app.use(cors());
  app.use(express.json());
  app.use(error);
  app.use("/api/ecashorder", eCashOrder_router);
  app.use("/api/auth", auth);
  app.use("/api/ecashorder/customerservice", customer);

  app.get("/", (req, res) => {
    res.send("ok");
  });

  app.get("/healthz", (req, res) => {
    res.send("ok");
  });
};
