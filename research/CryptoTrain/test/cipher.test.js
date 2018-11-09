const assert = require("assert");
const CipherWrapperClass = require("../CipherWrapper");

let cipher;

const algorithm="aes-256-cbc"
const password = "abcd12345";
beforeEach(
    ()=>{
        cipher = new CipherWrapperClass(algorithm,password);

    }
);

describe("Test Cipher",()=>{
        it("test cipher text",()=>{
            const message = "How are you?";
            const __crypted=cipher.encryptText(message);
            const de_msg=cipher.decryptText(__crypted);
            console.log(__crypted);
            assert.equal(message,de_msg);
        });
        it("test encrypt cipher file",()=>{
            const inputfilename="./data/SampleMessage.txt";
            const outputfilename=inputfilename+".encrypted";
            const decryptfilename=inputfilename+".decrypted";

            cipher.encryptFile(inputfilename,outputfilename).on('close', ()=> {
                cipher.decryptFile(outputfilename,decryptfilename);
            });
        });

        
    }
);