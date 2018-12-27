const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const config =require("config");

const provider = new HDWalletProvider(
    'answer margin gallery suit decide tonight custom crisp eternal modify tiger huge',
    'https://rinkeby.infura.io/v3/ddae119e519b4ed9b2d16eea07ab3498',
    0,10
    );

const web3=new Web3(provider);

async function getAccount  (){
        const accounts = await web3.eth.getAccounts();
        
        return accounts;
    };
    


module.exports.default=web3;
module.exports.getAccount=getAccount;