const assert = require("assert");
//const Request = require("Request");
const fetch = require('node-fetch');
const headers = {};
const debug=require("debug")("app:debug");
const debugdev=require("debug")("app:dev");
const eCashOrderBackEndCreate=require("../routes/eCashOrderBackend").create;

const {bankEncryptAndSignECashOrder,
    UserEncryptAndBankSignEcashOrder,
    UserVerifyECashOrderSignature,
    UserDecryptCashOrder}=require("../routes/eCashOrderBackend");


const URL = "http://localhost:8001/api/ecashorder";
beforeEach(
    ()=>{
        headers["Content-Type"]="application/json";

    }
);

async function createEncryptedCashOrderPromise(userid, finEntity,cashOrder){
    return new Promise((resolve,reject)=>{
        UserEncryptAndBankSignEcashOrder(userid,finEntity,cashOrder,
            (result)=>{
                resolve (result);
            },
            (err)=>{
                reject(err);
            }
            );
    });
    
}

describe("Test Encrypt Decrypt backend",()=>{
    /*
    it("Test CashOrder creation", async()=>{
        data={
            userid:"hirer",
            finEntity:"bankA",
            amount:100,
            DepositOrLoan:true
        };
        const cashorder= eCashOrderBackEndCreate(data.userid,data.amount,data.finEntity);
        debug(cashorder);

        
        bankEncryptAndSignECashOrder(data.finEntity,cashorder,
            (result)=>{
                debug(result);
                assert.ok(result);
            },
            (err)=>{
                debug(err.message);
                assert.fail(err.message);
            }
            );

    });*/
    
    it("Test CashOrder creation", async()=>{
        data={
            userid:"hirer",
            finEntity:"bankA",
            amount:100,
            DepositOrLoan:true
        };
        const cashorder= eCashOrderBackEndCreate(data.userid,data.amount,data.finEntity);
        debug(cashorder);

        
        UserEncryptAndBankSignEcashOrder(data.userid,data.finEntity,cashorder,
            (result)=>{
                //debug(result);
                assert.ok(result);
            },
            (err)=>{
                console.log(err.message);
                //assert.fail(err.message);
                assert.ok(false);
            }
            );

    });
    it("Test CashOrder verify signature", async()=>{
        data={
            userid:"hirer",
            finEntity:"bankA",
            amount:100,
            DepositOrLoan:true
        };
        const cashorder= eCashOrderBackEndCreate(data.userid,data.amount,data.finEntity);
        
        var encryptedEcashorderText=await createEncryptedCashOrderPromise(data.userid,data.finEntity,cashorder);
        //encryptedEcashorderText.encryptedCashorder.amount=0;
        //data.amount=0;
        //Travel 
        encryptedEcashorderText=JSON.stringify(encryptedEcashorderText);
        //console.log(encryptedEcashorderText);
        //debugdev(encryptedEcashorderText);

        const encryptedEcashorderJSON = JSON.parse(encryptedEcashorderText);
        UserVerifyECashOrderSignature(encryptedEcashorderJSON,(data.amount).toString(),
            (result)=>{
                console.log("ok:",result);
                //assert(result);
                assert(result);
            },
            (err)=>{
                console.log("not ok",err);
                assert.fail(err);
            });

    });

    it("Test CashOrder decrypt", async()=>{
        data={
            userid:"hirer",
            finEntity:"bankA",
            amount:100,
            DepositOrLoan:true
        };
        const cashorder= eCashOrderBackEndCreate(data.userid,data.amount,data.finEntity);
        
        var encryptedEcashorderText=await createEncryptedCashOrderPromise(data.userid,data.finEntity,cashorder);
        encryptedEcashorderText=JSON.stringify(encryptedEcashorderText);
        const encryptedEcashorderJSON = JSON.parse(encryptedEcashorderText);
        console.log(encryptedEcashorderJSON);
        UserDecryptCashOrder(encryptedEcashorderJSON,
            (result)=>{
                console.log(result);
            },
            (err)=>{
                console.log(err);
            }
            );

    });
});

/*
describe("Test Restful service client",()=>{
    it("Test CashOrder creation", async()=>{
        data={
            userid:"hirer",
            finEntity:"bankA",
            amount:100,
            DepositOrLoan:true
        };
        
        //const request = new Request("http://localhost:8001/api/ecashorder", options);

        const response = await fetch(URL, {
            method: 'POST',
            //mode: 'CORS',
            body: JSON.stringify(data),
            headers: headers
        });

        console.log(await response.json());
        assert.equal(response.status,200)

    });


} );
*/