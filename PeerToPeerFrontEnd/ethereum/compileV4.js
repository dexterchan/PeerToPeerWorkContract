const path = require('path');
const fs = require('fs-extra');
const solc=require('solc');

const buildPath = path.resolve(__dirname,"buildV4");
//remove all contents in folder "build"
fs.removeSync(buildPath); 

const myContractName="Peer2PeerWorkContract.V4.sol";
//Read source code 
const ContractPath = path.resolve(__dirname,'contracts',myContractName);
console.log(ContractPath);
const source = fs.readFileSync(ContractPath,'utf8');

//Compile the solidity contract by solidity compiler
const output= solc.compile(source,1).contracts;
console.log(output);

//Check if build path exists. If not, create the folder
fs.ensureDirSync(buildPath);

//module.exports=output.contracts[":CrowdFundCampaign",":CrowdFundCampaignFactory"];


//iterate the json output and write into the file
for (let contract in output){
    fs.outputJsonSync(

        path.resolve(buildPath,contract.replace(":","")+".json"),
        output[contract]
    );
}