const express=require("express");
const router=express.Router();
const Joi = require("joi");
const eCashOrderBackEndCreate=require("./eCashOrderBackend").create;

router.post("/",(req,res)=>{
    const {error} = validateOrder(req.body);
    if(error!=null) return res.status(400).send(error.details[0].message); //400 Bad Request
    const cashorder= eCashOrderBackEndCreate("abcd",1000.00,"HXXX");

    res.send(cashorder);
}
);

function validateOrder(eCashOrder){
    const schema={
        userid:Joi.string().required(),
        amount:Joi.number().min(0).required(),
        finEntity:Joi.string().required(),
        DepositOrLoan:Joi.boolean().required()
    };
    return Joi.validate(eCashOrder,schema);

}


module.exports=router;