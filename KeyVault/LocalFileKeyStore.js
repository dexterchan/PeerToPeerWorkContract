const config=require("config");
const path=require("path");
const fs = require("fs");

class MyKeyStore{
    constructor(){
        this.keyPath="./keys";
        this.privKeyext= ".privkey.pem";
        this.pubKeyext=".certificate.pem";
    }

    getPrivateKey(acct){
        const expectedFile = path.join( this.keyPath,acct+this.privKeyext);
        const file=fs.readFileSync(expectedFile);
        return file;
    }

    getPublicKey(acct){
        const expectedFile = path.join( this.keyPath,acct+this.pubKeyext);
        const file=fs.readFileSync(expectedFile);
        return file;
    }
}


module.exports=MyKeyStore;