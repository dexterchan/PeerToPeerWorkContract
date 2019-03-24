import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0x8F45DFEfC2369229571cD9624021DFf174fD1741";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
