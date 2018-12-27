const uuidv4 = require('uuid/v4');
const debug=require("debug")("app:debug");
const errorlog=require("debug")("app:error");
const debugdev=require("debug")("app:dev");
const pkeyCipherWrapperClass=require("../../CryptoWrapper/PkeyCipherWrapper");
const CipherIVWrapperClass=require("../../CryptoWrapper/CipherWrapperIV");
const KeyVault = require("../../KeyVault/KeyVaultService");

const paymentTemplate="TXN Id:${UUID} ${finEntity}: paying ${amount} from ${userid}";



const cipheralgorithm="aes-256-cbc";
const signAlgorithm="sha256";

createOrder=(userid,amount,finEntity)=>{
    const uuid=uuidv4();
    const eCashOrderDoc = paymentTemplate.replace("${UUID}",uuid)
                            .replace("${finEntity}",finEntity)
                            .replace("${amount}",amount.toString())
                            .replace("${userid}",userid);
    return {userid, amount, finEntity,eCashOrderDoc};
};

const UserEncryptAndBankSignEcashOrder=async (whoEncrypt,finEntity,eCashOrder,callback,errCallback)=>{
    try{
        const bankPrivateKey=await KeyVault.privateKeyAsyncPromise(finEntity);
        const UserPubKey = await KeyVault.publicKeyAsyncPromise(whoEncrypt);
        errorlog(UserPubKey);
        const encryptedSignResult=await pubKeyEncryptAndSignECashOrderPromise(eCashOrder,whoEncrypt,UserPubKey,bankPrivateKey);
        callback(encryptedSignResult);
    }catch(err){
        errorlog (err.message);
        errCallback(new Error(`${finEntity} is not available for service`));
    }
};

const UserVerifyECashOrderSignature=async (eCashOrder,amount,callback,errCallback)=>{
    
    try{
        const {encryptedCashorder,encryptedCashorderSignature} = eCashOrder;
        //console.log("enter",encryptedCashorder.amount," ",amount);
        if(encryptedCashorder.amount!=amount){
            throw new Error("ecashorder amount not matching expected");
        }
        //console.log("checked amt");
        finEntity=encryptedCashorder.finEntity;
        const bankPubKey=await KeyVault.publicKeyAsyncPromise(finEntity);
        const cipherDoc64withMeta=JSON.stringify(encryptedCashorder);
        //debugdev("verifyTEXT:",cipherDoc64withMeta);
        //debugdev("VsignatureBASE64:",encryptedCashorderSignature);
        const verifyResult=await pubKeyVerifyEcashOrderSignaturePromise(cipherDoc64withMeta,encryptedCashorderSignature,bankPubKey);
        callback(verifyResult);
    }catch(err){
        errorlog(err.message);
        errCallback(new Error(err.message));
    }
}

function pubKeyVerifyEcashOrderSignaturePromise(cipherDoc64withMeta,encryptedCashorderSignature,bankPubKey){
    return new Promise((resolve,reject)=>{
        try{
            const signature = Buffer.from(encryptedCashorderSignature,"base64").toString("hex");
            //debugdev("VsignatureHEX:",signature);
            const pubPkCipher = new pkeyCipherWrapperClass(cipheralgorithm, signAlgorithm);
            pubPkCipher.setPublicKey(bankPubKey);
            result = pubPkCipher.verifySignature(cipherDoc64withMeta, signature);
            resolve(result);
        }catch(ex){
            reject(ex);
        }
    });
}

function pubKeyEncryptAndSignECashOrderPromise (eCashOrder, whoEncrypt, usrPubKey, signPrivateKey){
    return new Promise((resolve, reject)=>{
        try{
            const eCashOrderDoc = eCashOrder.eCashOrderDoc;
            const pubPkCipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
            const signPkcipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
            debug("pkcipher initialized");
            const symKey = pubPkCipher.generateRandomKey();
            const sessioncipher= new CipherIVWrapperClass(cipheralgorithm,symKey);
            debug("sessioncipher initialized");
    
            pubPkCipher.setPublicKey(usrPubKey);
            signPkcipher.setPrivateKey(signPrivateKey);
            const IV = sessioncipher.IV;
            debug("key assigned");
            
            cipherText = sessioncipher.encryptText(eCashOrderDoc);
            //sym key encrypt by private key
            const cipherSymKey = pubPkCipher.publicEncrypt(symKey);
            cipherText64=Buffer.from(cipherText,"hex").toString("base64");
            cipherSymKeyString64 = Buffer.from(cipherSymKey,"hex").toString("base64");
            IV64 = IV.toString("base64");
    
            cipherDoc64withMeta={
                encryptedCashorder:cipherText64,
                finEntity:eCashOrder.finEntity,
                owner:eCashOrder.userid,
                encrypter:whoEncrypt,
                amount:eCashOrder.amount};
    
            //debugdev("TEXT:",JSON.stringify(cipherDoc64withMeta));
    
            //Sign the original doc
            originalCashOrderSig = signPkcipher.signSignature(eCashOrderDoc);
            originalCashOrderSig64 = Buffer.from(originalCashOrderSig,"hex").toString("base64");
    
            //Sign the encrypted doc
            encryptedCashOrderSig = signPkcipher.signSignature(JSON.stringify(cipherDoc64withMeta));
            encryptedCashOrderSig64=Buffer.from(encryptedCashOrderSig,"hex").toString("base64");
            //debugdev("SignatureHEX:",encryptedCashOrderSig);
            //debugdev("SignatureBASE64:",encryptedCashOrderSig64);

            resolve({encryptedCashorder:cipherDoc64withMeta,
                encryptedSymKey:cipherSymKeyString64,
                IV:IV64,
                orgCashorderSignature:originalCashOrderSig64,
                encryptedCashorderSignature:encryptedCashOrderSig64
            });
        }catch(err){
            reject(err);
        }
    });
};

const bankEncryptAndSignECashOrder=async (finEntity,eCashOrder,callback,errCallback)=>{
    try{
        const bankPrivateKey=await KeyVault.privateKeyAsyncPromise(finEntity);
        const encryptedSignResult=await encryptAndSignECashOrderPromise(eCashOrder,bankPrivateKey);
        callback(encryptedSignResult);
    }catch(err){
        errorlog (err.message);
        errCallback(new Error(`${finEntity} is not available for service`));
    }
};


function encryptAndSignECashOrderPromise (eCashOrder, bankPrivateKey){
    return new Promise((resolve, reject)=>{
        try{
            const eCashOrderDoc = eCashOrder.eCashOrderDoc;
            const signPkcipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
            debug("pkcipher initialized");
            const symKey = signPkcipher.generateRandomKey();
            const sessioncipher= new CipherIVWrapperClass(cipheralgorithm,symKey);
            debug("sessioncipher initialized");
    
            
            signPkcipher.setPrivateKey(bankPrivateKey);
            const IV = sessioncipher.IV;
    
            
            cipherText = sessioncipher.encryptText(eCashOrderDoc);
            //sym key encrypt by private key
            const cipherSymKey = signPkcipher.privateEncrypt(symKey);
            cipherText64=Buffer.from(cipherText,"hex").toString("base64");
            cipherSymKeyString64 = Buffer.from(cipherSymKey,"hex").toString("base64");
            IV64 = IV.toString("base64");
    
            cipherDoc64withMeta={
                encryptedCashorder:cipherText64,
                finEntity:eCashOrder.finEntity,
                owner:eCashOrder.userid,
                amount:eCashOrder.amount};
    
            debug(JSON.stringify(cipherDoc64withMeta));
    
            //Sign the original doc
            originalCashOrderSig = signPkcipher.signSignature(eCashOrderDoc);
            originalCashOrderSig64 = Buffer.from(originalCashOrderSig,"hex").toString("base64");
    
            //Sign the encrypted doc
            encryptedCashOrderSig = signPkcipher.signSignature(JSON.stringify(cipherDoc64withMeta));
            encryptedCashOrderSig64=Buffer.from(encryptedCashOrderSig,"hex").toString("base64");
    
            resolve({encryptedCashorder:cipherDoc64withMeta,
                encryptedSymKey:cipherSymKeyString64,
                IV:IV64,
                orgCashorderSignature:originalCashOrderSig64,
                encryptedCashorderSignature:encryptedCashOrderSig64
            });
        }catch(err){
            reject(err);
        }
    });
};


module.exports.create=createOrder;
module.exports.bankEncryptAndSignECashOrder=bankEncryptAndSignECashOrder;
module.exports.UserEncryptAndBankSignEcashOrder=UserEncryptAndBankSignEcashOrder;
module.exports.UserVerifyECashOrderSignature=UserVerifyECashOrderSignature;