
import web3 from './web3_query.js';
const compiledProjectABI=require("./buildV5/Peer2PeerProject.abi.json");


export default (deployedAddress)=>{
    return new web3.eth.Contract(
        compiledProjectABI
        ,deployedAddress
    );
};