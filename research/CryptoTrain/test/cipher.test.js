const assert = require("assert");
const path=require("path");
const fs = require("fs");
const CipherWrapperClass = require("../../../CryptoWrapper/CipherWrapper");
const pkeyCipherWrapperClass = require("../../../CryptoWrapper/PkeyCipherWrapper");
let cipher;
let pkcipher;

const cipheralgorithm="aes-256-cbc"
const signAlgorithm="sha256"
const password = "abcd12345";
const permFile = "./keys/egg.privkey.pem"
const certFile = "./keys/egg.certificate.pem"

beforeEach(
    ()=>{
        cipher = new CipherWrapperClass(cipheralgorithm,password);
        pkcipher = new pkeyCipherWrapperClass(cipheralgorithm,signAlgorithm);
    }
);

describe("Test Cipher",()=>{
        it("test cipher text",()=>{
            const message = "How are you?";
            const __crypted=cipher.encryptText(message);
            const de_msg=cipher.decryptText(__crypted);
            
            assert.equal(message,de_msg);
        });
        it("test encrypt cipher file",()=>{
            const inputfilename="./data/SampleMessage.txt";
            const outputfilename=inputfilename+".encrypted";
            const decryptfilename=inputfilename+".decrypted";

            cipher.encryptFile(inputfilename,outputfilename).on('close', ()=> {
                cipher.decryptFile(outputfilename,decryptfilename);
            });
            val=(compareFiles(inputfilename,decryptfilename));
            assert(val);
        });
        it("test async read pem file",()=>{
            const data=pkcipher.ReadAsyncPemFile(permFile);
            
        });
        it("test sync read pem file",()=>{
            var pathObj=path.parse(__dirname);
            ;
            pkcipher.ReadSyncPemFile(permFile);
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
            pkcipher.ReadSyncPemFile(permFile);
            const s=pkcipher.signSignature(inputText);
            pkcipher.ReadSyncCertFile(certFile);
            const result = pkcipher.verifySignature(inputText,s);
            assert(result);
        });
        it("test signature negative", ()=>{
            const inputfilename="./data/SampleMessage.txt";
            const inputText=fs.readFileSync(inputfilename);
            pkcipher.ReadSyncPemFile(permFile);
            var s=pkcipher.signSignature(inputText);
            s += "abcd";
            pkcipher.ReadSyncCertFile(certFile);
            const result = pkcipher.verifySignature(inputText,s);
            assert(!result);
        });
    }
);

function compareFiles(src, target){
    const srcText=fs.readFileSync(src).toString("utf8");
    const tText = fs.readFileSync(target).toString("utf8");
    return srcText===tText;
}