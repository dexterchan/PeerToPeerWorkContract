const assert = require('assert');
const ganache = require('ganache-cli'); //access Eth test network
const Web3 = require('web3'); //Web3 "class"

const fetch = require('node-fetch');
const headers = {};
const URL = "http://localhost:8001/api/ecashorder";

const provider = ganache.provider();
const web3 = new Web3(provider); //instance of Web3 connecting to ganache, replace it with main,test eth in future


const compiledFactoryABI=require("../ethereum/buildV5/Peer2PeerProjectDashBoard.abi.json");
const compiledProjectABI=require("../ethereum/buildV5/Peer2PeerProject.abi.json");

const compliedFactoryEVM=require("../ethereum/buildV5/Peer2PeerProjectDashBoard.evm.json");
const compliedProjectEVM=require("../ethereum/buildV5/Peer2PeerProject.evm.json");

let accounts;
let factory;
let projectAddress;
let project;
let hirerAddress;
let hireeAddress;
let eCashOrder;

async function  createEcashOrder(){
    data={
        userid:"hirer",
        finEntity:"bankA",
        amount:100,
        DepositOrLoan:true
    };

    const response = await fetch(URL, {
        method: 'POST',
        //mode: 'CORS',
        body: JSON.stringify(data),
        headers: headers
    });

    const eCashOrder=(await response.json());
    assert.equal(response.status,200);
    return eCashOrder;
}

beforeEach(
    async()=>{
        //New promise async
        //Get a list of all accounts
        accounts = await web3.eth.getAccounts();

        factory=await new web3.eth.Contract(compiledFactoryABI)
        .deploy({data:"0x"+compliedFactoryEVM.bytecode.object }) //tell web3 to prepare a copy of contract for deployment
        .send({from: accounts[0] ,  gas:6024164});

        hirerAddress = accounts[1];
        hireeAddress = accounts[2];

        let _task_des="Test project";
        let _reward=1;
        let _minCredit=100;
        let _duration="3M";
        retObj=await factory.methods.createProject(
            _task_des,_reward,_minCredit,_duration
        ).send(
            {
                from: hirerAddress,  gas:2932859
            }
        );
        const addresses=await factory.methods.getDeployedProjects().call();
        projectAddress=addresses[0];
        
        
        console.log("returned object:"+(retObj.transactionHash));
        //console.log("readaddress:"+addresses[0]);
        
        project=await new web3.eth.Contract(
            compiledProjectABI
            ,projectAddress);

        headers["Content-Type"]="application/json";
        
        

    }
);


describe("Test Ethereum contract",()=>{
        it("deposit eCashOrder", async()=>{
            const newECashOrder=await createEcashOrder();
            let strNewECashOrder = JSON.stringify(newECashOrder);
            //strNewECashOrder = strNewECashOrder.replace(/\"/g,"\\\"");
            //console.log(strNewECashOrder);
            //const recoveredEcashOrder=JSON.parse(strNewECashOrder);
            //console.log(strNewECashOrder.replace(/\\\"/g,"\""));
            const recoveredEcashOrder=JSON.parse(strNewECashOrder.replace(/\\\"/g,"\""));

            await project.methods.deployCashOrder(strNewECashOrder).send(
                {from: hirerAddress ,gas:5049200}
            );

            const deployedContract=await project.methods.hirerEncryptedCashOrder().call();
            assert.equal(deployedContract,strNewECashOrder);
        });
        it("hiree takes job",async()=>{
            const newECashOrder=await createEcashOrder();
            let strNewECashOrder = JSON.stringify(newECashOrder);
            await project.methods.deployCashOrder(strNewECashOrder).send(
                { from: hirerAddress, gas: 5049200 }
            );
            //hireeTakeJob

            await project.methods.hireeTakeJob().send(
                { from: hireeAddress, gas: 5049200 }
            );
            const hiree = await project.methods.hiree().call();

            assert(hiree == hireeAddress);

        });
        it("hiree submits work",async()=>{
            const newECashOrder=await createEcashOrder();
            let strNewECashOrder = JSON.stringify(newECashOrder);
            await project.methods.deployCashOrder(strNewECashOrder).send(
                { from: hirerAddress, gas: 5049200 }
            );
            //hireeTakeJob

            await project.methods.hireeTakeJob().send(
                { from: hireeAddress, gas: 5049200 }
            );
            const hiree = await project.methods.hiree().call();

            //hireeSubmitWork
            const jobdone="JOb is done";
            await project.methods.hireeSubmitWork(jobdone).send(
                { from: hireeAddress, gas: 5049200 }
            );
            await project.methods.hireeSubmitWork(jobdone+" more info").send(
                { from: hireeAddress, gas: 5049200 }
            );
            const cnt = await project.methods.getWorkLogCount().call();
            assert(cnt==2);

        });
        it("hirer accepts work",async()=>{
            const newECashOrder=await createEcashOrder();
            let strNewECashOrder = JSON.stringify(newECashOrder);
            await project.methods.deployCashOrder(strNewECashOrder).send(
                { from: hirerAddress, gas: 5049200 }
            );
            //hireeTakeJob

            await project.methods.hireeTakeJob().send(
                { from: hireeAddress, gas: 5049200 }
            );
            const hiree = await project.methods.hiree().call();

            //hireeSubmitWork
            const jobdone="JOb is done";
            await project.methods.hireeSubmitWork(jobdone).send(
                { from: hireeAddress, gas: 5049200 }
            );

            //hirer accept work
            const comment="missing ABC";
            await project.methods.hirerAcceptWork(comment,false,true).send(
                { from: hirerAddress, gas: 5049200 }
            );

            const num = await project.methods.getWorkLogCount().call();
            const workLogs = await project.methods.workLogs(num-1).call();
            assert(workLogs.hirerComment,comment);
            console.log(workLogs);
            const summary = await project.methods.getWorkContractSummary().call();
            console.log(summary);

            let date = new Date(summary[9] * 1000);
            console.log("Convert to date:",date);

            
        });

        it("hiree get paid",async()=>{
            const newECashOrder=await createEcashOrder();
            let strNewECashOrder = JSON.stringify(newECashOrder);
            await project.methods.deployCashOrder(strNewECashOrder).send(
                { from: hirerAddress, gas: 5049200 }
            );
            //hireeTakeJob

            await project.methods.hireeTakeJob().send(
                { from: hireeAddress, gas: 5049200 }
            );
            const hiree = await project.methods.hiree().call();

            //hireeSubmitWork
            const jobdone="JOb is done";
            await project.methods.hireeSubmitWork(jobdone).send(
                { from: hireeAddress, gas: 5049200 }
            );

            //hirer accept work
            const comment="missing ABC";
            await project.methods.hirerAcceptWork(comment,false,true).send(
                { from: hirerAddress, gas: 5049200 }
            );

            const num = await project.methods.getWorkLogCount().call();
            const workLogs = await project.methods.workLogs(num-1).call();
            assert(workLogs.hirerComment,comment);
            console.log(workLogs);
            const summary = await project.methods.getWorkContractSummary().call();
            console.log(summary);

            let date = new Date(summary[9] * 1000);
            console.log("Convert to date:",date);

            
        });
}
);
