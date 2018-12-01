const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');

class CipherWrapper{
    


    constructor(cipheralgorithm,key,IV){
        if(cipheralgorithm.length==0)
            this.cipheralgorithm="aes-256-cbc";
        else
            this.cipheralgorithm=cipheralgorithm;
        
        const bufferKey = Buffer.alloc(32);

        this.key=Buffer.concat([Buffer.from(key)], bufferKey.length);
        this.srccoding="utf8";
        this.encryptcoding="hex";
        this.blockSize=256;
        /*
        if(IV==undefined)
            
        else*/
        
        if(IV)
            this.IV=IV;
        else
            this.IV=this.generateIV(16);
    }

    createMyCipher(){
        if(!this.key){
            throw new Error("No key defined for cipher");
        }
        const cipher = crypto.createCipheriv(this.cipheralgorithm, this.key,this.IV);
        return cipher;
    }
    createMyDecipher(){
        if(!this.key){
            throw new Error("No key defined for cipher");
        }
        const decipher = crypto.createDecipheriv(this.cipheralgorithm, this.key,this.IV);
        return decipher;
    }


    encryptText(text){
        const cipher = this.createMyCipher();
        
        var crypted = cipher.update(text,this.srccoding,this.encryptcoding);
        crypted += cipher.final(this.encryptcoding);
        return crypted; 
    }
    decryptText(cipherText){
        const decipher = this.createMyDecipher();
    
        var dec = decipher.update(cipherText,this.encryptcoding,this.srccoding);
        dec += decipher.final(this.srccoding);
        return dec;
    }

    encryptStream(inputStream){
        // zip content
        const zip = zlib.createGzip();
        const cipher = this.createMyCipher();

        return inputStream.pipe(zip).pipe(cipher);
        //return inputStream.pipe(cipher);
    }
    encryptFile(inputfilename,outputfilename){
        // input file
        const r = fs.createReadStream(inputfilename);
        const es=this.encryptStream(r);
        const w = fs.createWriteStream(outputfilename);
        const outstream=es.pipe(w); 
        return outstream;
    }
    decryptStream(inputStream){
        const unzip = zlib.createGunzip();
        const decipher = this.createMyDecipher();
        return inputStream.pipe(decipher).pipe(unzip);
        //return inputStream.pipe(decipher);
    }
    decryptFile(inputfilename,outputfilename){
        // input file
        const r = fs.createReadStream(inputfilename);
        const ds = this.decryptStream(r);
        const w = fs.createWriteStream(outputfilename);
        const outstream=ds.pipe(w); 
        return outstream;
    }

    generateRandomKey(){
        return crypto.randomBytes(this.RSAAsyncSize).toString('hex');
    }
    generateIV(len){
        return crypto.randomBytes(len);
    }
}

module.exports=CipherWrapper;