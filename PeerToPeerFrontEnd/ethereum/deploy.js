const acct = require("./web3_transact").getAccount;
const web3 = require("./web3_transact").default;

async function testAcct(){
    const acctlist = await acct();
    console.log(acctlist);
}
//testAcct();
async function listWeb3Acct(){
    const acctlist = await web3.eth.getAccounts();
    console.log(acctlist);
}
listWeb3Acct();

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");
const compliedFactoryEVM=require("./buildV5/Peer2PeerProjectDashBoard.evm.json");


const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account",accounts[0]);
    const factoryContract =new web3.eth.Contract(compiledFactoryABI);
    const result=await factoryContract
        .deploy({data:"0x"+compliedFactoryEVM.bytecode.object})
        .send( {gas:5024164, from: accounts[0]}); //a bug on Throffle wallet with gas parameter
    
    console.log("Contract deployed to ", result.options.address);   
    
    const minCredit=10000;
    //Add members
    //CreateRSA.SelfSigned.OpenSSL.sh Alice
    factoryContract.addMember(accounts[0],"Alice",minCredit);
    //CreateRSA.SelfSigned.OpenSSL.sh Bob
    //CreateRSA.SelfSigned.OpenSSL.sh R2
    //CreateRSA.SelfSigned.OpenSSL.sh Dumbo
    //CreateRSA.SelfSigned.OpenSSL.sh Tony

    
};
deploy();