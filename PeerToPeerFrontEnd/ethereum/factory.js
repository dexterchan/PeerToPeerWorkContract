import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0xb2e9617eeC43e176A6325D70c13Edb267089A1b7";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
