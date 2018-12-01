const CipherWrapper = require("./CipherWrapper");
const crypto = require('crypto');
const fs = require("fs");
class PkeyCipherWrapper extends CipherWrapper{
    
    constructor(cipher_algorithm,hash_algorithm){
        super(cipher_algorithm,"")
        this.signAlgorithm=hash_algorithm;
        
        this.RSAAsyncSize=100;
    }
    
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
            const pub=fs.readFileSync(certFile);
            this.pub = pub.toString('ascii');
        }catch (err){
            console.log(err);
        }
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
        if(!this.pub){
            throw new Error("No public key defined for verifying signature");
        }
        const verify = crypto.createVerify(this.signAlgorithm); 
        verify.update(text);
        return verify.verify(this.pub, sig, this.encryptcoding);
    }

    publicEncryptHex(hex){
        if(!this.pub){
            throw new Error("No public key defined for encryption");
        }
        const buf = Buffer.from(hex);
        return crypto.publicEncrypt(this.pub, buf);

    }
    publicDecryptHex(buf){
        if(!this.pub){
            throw new Error("No public key defined for decryption");
        }
        return crypto.publicDecrypt(this.pub,buf);
    }
    privateEncryptHex(hex){
        if(!this.key){
            throw new Error("No key defined for encryption");
        }
        const buf = Buffer.from(hex);
        return crypto.privateEncrypt(this.key,buf);
    }
    privateDecryptHex(buf){
        if(!this.key){
            throw new Error("No key defined for decryption");
        }
        //const buf = Buffer.from(cipherHex);
        return crypto.privateDecrypt(this.key,buf);
    }
    
    
};

module.exports=PkeyCipherWrapper;