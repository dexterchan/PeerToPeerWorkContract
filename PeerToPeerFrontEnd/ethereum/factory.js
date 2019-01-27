import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0xD7f2DA11867f6D9796abDEc271C3E607444112B1";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
