const express=require("express");
const router=express.Router();
const Joi = require("joi");
const zlib = require('zlib');
const debug=require("debug")("app:debug");
const KeyVault = require("../../KeyVault/KeyVaultService");
const eCashOrderBackEndCreate=require("./eCashOrderBackend").create;

const {bankEncryptAndSignECashOrder}=require("./eCashOrderBackend");


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
    
    bankEncryptAndSignECashOrder(requestJson.finEntity,cashorder,
        (result)=>{
            res.send(result);
        },
        (err)=>{
            res.status(400).send(err.message);
        }
        );

    /*
    //get the private key of bank
    bankPrivateKey=KeyVault.privateKeyFunc(requestJson.finEntity);

    try{
        
        const pkcipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
        debug("pkcipher initialized");
        const symKey = pkcipher.generateRandomKey();
        const sessioncipher= new CipherIVWrapperClass(cipheralgorithm,symKey);
        debug("sessioncipher initialized");

        
        pkcipher.setPrivateKey(bankPrivateKey);
        const IV = sessioncipher.IV;

        
        cipherText = sessioncipher.encryptText(cashorder);
        //sym key encrypt by private key
        const cipherSymKey = pkcipher.privateEncrypt(symKey);
        cipherText64=Buffer.from(cipherText,"hex").toString("base64");
        cipherSymKeyString64 = Buffer.from(cipherSymKey,"hex").toString("base64");
        IV64 = IV.toString("base64");

        cipherDoc64withMeta={encryptedCashorder:cipherText64,finEntity:requestJson.finEntity,amount:requestJson.amount};

        debug(JSON.stringify(cipherDoc64withMeta));

        //Sign the original doc
        originalCashOrderSig = pkcipher.signSignature(cashorder);
        originalCashOrderSig64 = Buffer.from(originalCashOrderSig,"hex").toString("base64");

        //Sign the encrypted doc
        encryptedCashOrderSig = pkcipher.signSignature(JSON.stringify(cipherDoc64withMeta));
        encryptedCashOrderSig64=Buffer.from(encryptedCashOrderSig,"hex").toString("base64");

    }catch(err){
        return res.status(400).send(err.message);
    }
    
    res.send({encryptedCashorder:cipherDoc64withMeta,
        encryptedSymKey:cipherSymKeyString64,
        IV:IV64,
        orgCashorderSignature:originalCashOrderSig64,
        encryptedCashorderSignature:encryptedCashOrderSig64
    });
    */
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