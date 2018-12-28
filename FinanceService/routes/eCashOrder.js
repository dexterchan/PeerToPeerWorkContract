const express=require("express");
const router=express.Router();
const Joi = require("joi");
const zlib = require('zlib');
const debug=require("debug")("app:debug");
const KeyVault = require("../../KeyVault/KeyVaultService");
const eCashOrderBackEndCreate=require("./eCashOrderBackend").create;

const {
    UserEncryptAndBankSignEcashOrder,
    UserVerifyECashOrderSignature,
    UserChangeSymKeyOwnerShip}=require("./eCashOrderBackend");



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
router.post("/verifysignature",(req,res)=>{
    requestJSON=req.body;
    UserVerifyECashOrderSignature(requestJSON,requestJSON.encryptedCashorder.amount,
        (result)=>{
            let flag="invalid";
            if(result){
                flag="valid";
            }
            res.send({result:flag});
        },
        (err)=>{
            res.status(400).send({result:"error in signature verify"});
        }
        );

});
router.post("/changeowner/:newid",(req,res)=>{
    const newUserId=req.params.newid;
    requestJSON=req.body;
    UserChangeSymKeyOwnerShip(requestJSON,newUserId,
        (result)=>{
            
            res.send(result);
        },
        (err)=>{
            res.status(400).send({result:"error in change ownership"});
        }
        );

});




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