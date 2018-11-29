const CipherWrapper = require("./CipherWrapper");
const crypto = require('crypto');
const fs = require("fs");
class PkeyCipherWrapper extends CipherWrapper{
    
    
    
    async ReadAsyncPemFile(pemFile){
        try{
            const pem=await new Promise((resolve, reject)=>{
                //async work
                fs.readFile(pemFile, (err,data)=>{
                    if(err ){
                        reject(err);
                    }else{
                        resolve (data);
                    }
                });
            });
            this.key = pem.toString('ascii');
           
        }catch (err){
            console.log(err);
        }
    }

    ReadSyncPemFile(pemFile){
        try{
            const pem=fs.readFileSync(pemFile);
            this.key = pem.toString('ascii');
        }catch (err){
            console.log(err);
        }
    }

    ReadSyncCertFile(certFile){
        try{
            const cert=fs.readFileSync(certFile);
            this.cert = cert.toString('ascii');
        }catch (err){
            console.log(err);
        }
    }

    constructor(cipher_algorithm,hash_algorithm){
        super(cipher_algorithm,"")
        this.signAlgorithm=hash_algorithm;
        
        
    }

    signSignature(text){
        if(!this.key){
            throw new Error("No key defined for signature");
        }
        const sign = crypto.createSign(this.signAlgorithm);
        sign.update(text);
        const sig = sign.sign(this.key, this.encryptcoding);

        return sig;
    }

    verifySignature(text,sig){
        if(!this.cert){
            throw new Error("No cert defined for verifying signature");
        }
        const verify = crypto.createVerify(this.signAlgorithm); 
        verify.update(text);
        return verify.verify(this.cert, sig, this.encryptcoding);
    }

};

module.exports=PkeyCipherWrapper;