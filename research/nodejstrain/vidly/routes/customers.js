
const express = require('express');
const {Customer,validateCustomer} = require("../models/customer");

const router = express.Router();



router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    });

    customer = await customer.save();
    res.send(customer);
});


  
  module.exports = router;