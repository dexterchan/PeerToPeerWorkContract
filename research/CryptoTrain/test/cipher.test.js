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
            const cipherSymKey = pkcipher.publicEncryptHex(symKey);

            //transfer
            cipherSymKeyString = cipherSymKey.toString("hex");
            transferedCipher = Buffer.from(cipherSymKeyString,"hex");
            
            //sym key decrypt by private key
            const decryptedKey = pkcipher.privateDecryptHex(transferedCipher);
            const mydecipher= new CipherIVWrapperClass(cipheralgorithm,decryptedKey,IV);
            //decrypted symkey decrypt cipher text
            const decruptedText=mydecipher.decryptText(cipherText);
            assert (symKey==decryptedKey);
            assert.equal (inputText,decruptedText);
            debugAll(decruptedText);
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
            const cipherSymKey = pkcipher.privateEncryptHex(symKey);

            //transfer
            cipherSymKeyString = cipherSymKey.toString("hex");
            transferedCipher = Buffer.from(cipherSymKeyString,"hex");

            //sym key decrypt by public key
            const decryptedKey = pkcipher.publicDecryptHex(transferedCipher);
            const mydecipher= new CipherIVWrapperClass(cipheralgorithm,decryptedKey,IV);
            
            //decrypted symkey decrypt cipher text
            const decruptedText=mydecipher.decryptText(cipherText);
            assert (symKey==decryptedKey);
            assert.equal (inputText,decruptedText);
            debugAll(decruptedText);
        });

    }
);

function compareFiles(src, target){
    const srcText=fs.readFileSync(src).toString("utf8");
    const tText = fs.readFileSync(target).toString("utf8");
    return srcText===tText;
}