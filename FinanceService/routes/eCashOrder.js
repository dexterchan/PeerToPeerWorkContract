const express=require("express");
const router=express.Router();
const Joi = require("joi");
const zlib = require('zlib');
const debug=require("debug")("app:debug");
const KeyVault = require("../../KeyVault/KeyVaultService");
const eCashOrderBackEndCreate=require("./eCashOrderBackend").create;

const {bankEncryptAndSignECashOrder,UserEncryptAndBankSignEcashOrder}=require("./eCashOrderBackend");



//To be removed to backend
const pkeyCipherWrapperClass=require("../../CryptoWrapper/PkeyCipherWrapper");
const CipherIVWrapperClass=require("../../CryptoWrapper/CipherWrapperIV");

const cipheralgorithm="aes-256-cbc";
const signAlgorithm="sha256";
//To be removed to backend



router.post("/",(req,res)=>{
    requestJson=req.body;
    const {error} = validateOrder(requestJson);
    if(error!=null) return res.status(400).send(error.details[0].message); //400 Bad Request
    const cashorder= eCashOrderBackEndCreate(requestJson.userid,requestJson.amount,requestJson.finEntity);

    debug("do encrytion");
    
    /*
    bankEncryptAndSignECashOrder(requestJson.finEntity,cashorder,
        (result)=>{
            res.send(result);
        },
        (err)=>{
            res.status(400).send(err.message);
        }
        );*/
    UserEncryptAndBankSignEcashOrder(requestJson.userid,requestJson.finEntity,cashorder,
        (result)=>{
            res.send(result);
        },
        (err)=>{
            res.status(400).send(err.message);
        }
        );
    
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