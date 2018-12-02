const assert = require("assert");
const debugAll = require("debug")("app:dumpall");
const debug = require("debug")("app:debug");
const path=require("path");
const fs = require("fs");
const CipherWrapperClass = require("../../../CryptoWrapper/CipherWrapper");
const pkeyCipherWrapperClass = require("../../../CryptoWrapper/PkeyCipherWrapper");
const CipherIVWrapperClass = require("../../../CryptoWrapper/CipherWrapperIV");
let cipher;
let pkcipher;

const cipheralgorithm="aes-256-cbc";
const signAlgorithm="sha256";
const password = "abcd12345";
const permFile = "./keys/egg.privkey.pem";
const certFile = "./keys/egg.certificate.pem";

beforeEach(
    ()=>{
        //cipher = new CipherWrapperClass(cipheralgorithm,password);
        pkcipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
        cipherIV = new CipherIVWrapperClass (cipheralgorithm,password);
        pkcipher.ReadSyncPemFile(permFile);
        pkcipher.ReadSyncCertFile(certFile);
    }
);

describe("Test Cipher",()=>{
        it("test cipher IV text",()=>{
            const message = "How are you?";

            const IV = cipherIV.IV;
            debugAll("Cipher IV:"+IV.toString("hex"));

            const __crypted=cipherIV.encryptText(message);
            const __decrypter = new CipherIVWrapperClass (cipheralgorithm,password,IV);

            const de_msg=__decrypter.decryptText(__crypted);
            
            assert.equal(message,de_msg);
        });
        
        it("test encrypt cipher file",()=>{
            const inputfilename="./data/SampleMessage.txt";
            const outputfilename=inputfilename+".encrypted";
            const decryptfilename=inputfilename+".decrypted";
            const IV = cipherIV.IV;
            cipherIV.encryptFile(inputfilename,outputfilename).on('close', ()=> {
                const __decrypter = new CipherIVWrapperClass (cipheralgorithm,password,IV);
                __decrypter.decryptFile(outputfilename,decryptfilename);
            });
            val=(compareFiles(inputfilename,decryptfilename));
            assert(val);
        });
        
        it("test sync read pem file",()=>{
            var pathObj=path.parse(__dirname);
            
            const inputfilename="./data/SampleMessage.txt";
            const outputfilename=inputfilename+".cert.encrypted";
            const decryptfilename=inputfilename+".cert.decrypted";
            pkcipher.encryptFile(inputfilename,outputfilename).on('close', ()=> {
                pkcipher.decryptFile(outputfilename,decryptfilename);
            });
            val=(compareFiles(inputfilename,decryptfilename));
            assert(val);
        });
        it("test signature", ()=>{
            const inputfilename="./data/SampleMessage.txt";
            const inputText=fs.readFileSync(inputfilename);
            
            const s=pkcipher.signSignature(inputText);
            
            const result = pkcipher.verifySignature(inputText,s);
            assert(result);
        });
        it("test signature negative", ()=>{
            const inputfilename="./data/SampleMessage.txt";
            const inputText=fs.readFileSync(inputfilename);
            
            var s=pkcipher.signSignature(inputText);
            s += "abcd";
            
            const result = pkcipher.verifySignature(inputText,s);
            assert(!result);
        });

        it("test async public key encrypt workflow",()=>{
            const inputfilename="./data/SampleMessage.txt";
            const inputText=fs.readFileSync(inputfilename);
            //generate a new symmetric key and encrypt msg
            const symKey = pkcipher.generateRandomKey();
            const mycipher= new CipherIVWrapperClass(cipheralgorithm,symKey);
            const IV = mycipher.IV;
            cipherText = mycipher.encryptText(inputText);

            //sym key encrypt by public key
            const cipherSymKey = pkcipher.publicEncrypt(symKey);

            //transfer
            cipherText64=Buffer.from(cipherText,"hex").toString("base64");
            cipherSymKeyString64 = Buffer.from(cipherSymKey,"hex").toString("base64");
            IV64 = IV.toString('base64');
            debugAll("cipher key length:"+cipherSymKeyString64.length);
            debugAll(cipherSymKeyString64);
            transferedCipher = Buffer.from(cipherSymKeyString64,"base64").toString("hex");
            transferedcipherText = Buffer.from(cipherText64,"base64").toString("hex");
            transferedIV = Buffer.from(IV64,"base64");
            
            //sym key decrypt by private key
            const decryptedKey = pkcipher.privateDecrypt(transferedCipher);
            const mydecipher= new CipherIVWrapperClass(cipheralgorithm,decryptedKey,transferedIV);
            //decrypted symkey decrypt cipher text
            const decruptedText=mydecipher.decryptText(transferedcipherText);
            assert (symKey==decryptedKey);
            assert.equal (inputText,decruptedText);
            //debugAll(decruptedText);
        });

        it("test async private key encrypt workflow",()=>{
            const inputfilename="./data/SampleMessage.txt";
            const inputText=fs.readFileSync(inputfilename);

            //generate a new symmetric key and encrypt msg
            const symKey = pkcipher.generateRandomKey();
            const mycipher= new CipherIVWrapperClass(cipheralgorithm,symKey);
            const IV = mycipher.IV;
            cipherText = mycipher.encryptText(inputText);

            //sym key encrypt by private key
            const cipherSymKey = pkcipher.privateEncrypt(symKey);

            
            //transfer
            cipherText64=Buffer.from(cipherText,"hex").toString("base64");
            cipherSymKeyString64 = Buffer.from(cipherSymKey,"hex").toString("base64");
            IV64 = IV.toString('base64');
            debugAll("cipher key length:"+cipherSymKeyString64.length);
            debugAll(cipherSymKeyString64);
            transferedCipher = Buffer.from(cipherSymKeyString64,"base64").toString("hex");
            transferedcipherText = Buffer.from(cipherText64,"base64").toString("hex");
            transferedIV = Buffer.from(IV64,"base64");


            //sym key decrypt by public key
            const decryptedKey = pkcipher.publicDecrypt(transferedCipher);
            const mydecipher= new CipherIVWrapperClass(cipheralgorithm,decryptedKey,transferedIV);
            
            //decrypted symkey decrypt cipher text
            const decruptedText=mydecipher.decryptText(transferedcipherText);
            assert (symKey==decryptedKey);
            assert.equal (inputText,decruptedText);
            //debugAll(decruptedText);
        });

    }
);

function compareFiles(src, target){
    const srcText=fs.readFileSync(src).toString("utf8");
    const tText = fs.readFileSync(target).toString("utf8");
    return srcText===tText;
}