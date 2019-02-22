import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0x78F8F262f379951EeFdEf1c62125341f41494AA2";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
