const config=require("config");
const path=require("path");
const debug=require("debug")("app:debug");
//Configuration
const SrcKeyStore = config.get("store");
//load keystore
const MyKeyStore=require("./"+SrcKeyStore);

keyStore=new MyKeyStore();
privateKeyFunc=(acct)=>{
    try{
    return keyStore.getPrivateKey(acct).toString("ascii")
    }catch(err){
        throw new Error(`user ${acct} key not found`)
    }
};

publicKeyFunc=(acct)=>{
    try{
    return keyStore.getPublicKey(acct).toString("ascii");
    }catch(err){
        throw new Error(`user ${acct} cert not found`)
    }
};


module.exports.publicKeyFunc=publicKeyFunc;
module.exports.privateKeyFunc=privateKeyFunc;