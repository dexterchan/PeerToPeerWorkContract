const assert = require("assert");
//const Request = require("Request");
const fetch = require('node-fetch');
const headers = {};
const URL = "http://localhost:8001/api/ecashorder";
beforeEach(
    ()=>{
        headers["Content-Type"]="application/json";

    }
);

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