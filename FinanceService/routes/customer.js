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
  try {
    const res_r = await axios.get(URL);
    /*const res_r = {
      id: "dummy",
      data: { url: URL, id: id },
      status: 200
    };*/

    if (res_r.status === 200) {
      //console.log(res_r.data);
      res.status(200).send(res_r.data);
    } else {
      res.status(400).send("failed to get:" + id);
    }
  } catch (ex) {
    const errmsg = `Failed to retrieve ${URL}:(${ex.message})`;
    res.status(404).send(errmsg);
  }
});
module.exports = router;
