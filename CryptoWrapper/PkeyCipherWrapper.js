const CipherWrapper = require("./CipherWrapper");

const crypto = require('crypto');
const fs = require("fs");
class PkeyCipherWrapper extends CipherWrapper{
    
    constructor(cipher_algorithm,hash_algorithm){
        super(cipher_algorithm,"");
        this.signAlgorithm=hash_algorithm;
        
        this.RSAAsyncSize=100;
    }
    /*
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
    }*/

    setPrivateKey(key){

        
        this.key=key;
    }
    setPublicKey(pub){
        this.pub=pub;
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

    publicEncrypt(msg){
        if(!this.pub){
            throw new Error("No public key defined for encryption");
        }
        const buf = Buffer.from(msg);
        const cipherBuf= crypto.publicEncrypt(this.pub, buf);

        return cipherBuf.toString(this.encryptcoding);
    }
    publicDecrypt(cipherHex){
        if(!this.pub){
            throw new Error("No public key defined for decryption");
        }
        const buf = Buffer.from(cipherHex,this.encryptcoding);
        return crypto.publicDecrypt(this.pub,buf);
    }
    privateEncrypt(msg){
        if(!this.key){
            throw new Error("No key defined for encryption");
        }
        const buf = Buffer.from(msg);
        const cipherBuf= crypto.privateEncrypt(this.key,buf);
        return cipherBuf.toString(this.encryptcoding);
    }
    privateDecrypt(cipherHex){
        if(!this.key){
            throw new Error("No key defined for decryption");
        }
        
        const buf = Buffer.from(cipherHex,this.encryptcoding);
        return crypto.privateDecrypt(this.key,buf);
    }
    
    
}

module.exports=PkeyCipherWrapper;