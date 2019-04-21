const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("customer OK");
});
router.get("/:id", async (req, res) => {
  const customer = {
    id: req.params.id
  };
  res.status(200).send(customer);
});

module.exports = router;
