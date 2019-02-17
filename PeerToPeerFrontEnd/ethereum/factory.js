import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0x998D51d6B4B3B995849e4c7193899F5E5c4E1bC3";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
