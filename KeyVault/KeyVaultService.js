const config=require("config");
const path=require("path");
const debug=require("debug")("app:debug");
//Configuration
const SrcKeyStore = config.get("store");
//load keystore
const MyKeyStore=require("./"+SrcKeyStore);

keyStore=new MyKeyStore();
privateKeyFunc=(acct)=>{
    return keyStore.getPrivateKey(acct).toString("ascii")
};

publicKeyFunc=(acct)=>{
    return keyStore.getPublicKey(acct).toString("ascii");
};


module.exports.publicKeyFunc=publicKeyFunc;
module.exports.privateKeyFunc=privateKeyFunc;