


import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0xDc0d6919f192386878cA9E290c798A751D5807a1";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
