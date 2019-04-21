const express = require("express");
const config = require("config");
const router = express.Router();
const axios = require("axios");
const DEBUG = require("debug")("app:debug");
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const hostnameport = config.get("customerservice");

  const URL = `http://${hostnameport}/${id}`;
  DEBUG(hostnameport);
  DEBUG(URL);
  const res_r = await axios.get(URL);
  DEBUG(res_r.data);
  if (res_r.status == 200) {
    res.status(200).send(res_r.data);
  } else {
    res.status(400).send("failed to get:" + id);
  }
});
module.exports = router;
