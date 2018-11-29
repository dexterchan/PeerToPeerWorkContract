const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');

class CipherWrapper{
    
    constructor(cipheralgorithm,key){
        if(cipheralgorithm.length==0)
            this.cipheralgorithm="aes-256-cbc";
        else
            this.cipheralgorithm=cipheralgorithm;
        this.key=key;
        this.srccoding="utf8";
        this.encryptcoding="hex";

    }

    createMyCipher(){
        if(!this.key){
            throw new Error("No key defined for cipher");
        }
        const cipher = crypto.createCipher(this.cipheralgorithm, this.key);
        return cipher;
    }
    createMyDecipher(){
        if(!this.key){
            throw new Error("No key defined for decipher");
        }
        const decipher = crypto.createDecipher(this.cipheralgorithm,this.key);
        return decipher;
    }

    encryptText(text){
        const cipher = this.createMyCipher();
        
        var crypted = cipher.update(text,this.srccoding,this.encryptcoding);
        crypted += cipher.final(this.encryptcoding);
        return crypted; 
    }
    decryptText(text){
        const decipher = this.createMyDecipher();
    
        var dec = decipher.update(text,this.encryptcoding,this.srccoding);
        dec += decipher.final(this.srccoding);
        return dec;
    }

    encryptStream(inputStream){
        // zip content
        const zip = zlib.createGzip();
        const cipher = this.createMyCipher();

        return inputStream.pipe(zip).pipe(cipher);
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
    }
    decryptFile(inputfilename,outputfilename){
        // input file
        const r = fs.createReadStream(inputfilename);
        const ds = this.decryptStream(r);
        const w = fs.createWriteStream(outputfilename);
        const outstream=ds.pipe(w); 
        return outstream;
    }

}

module.exports=CipherWrapper;