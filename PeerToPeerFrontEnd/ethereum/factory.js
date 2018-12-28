import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0x700588665B131449a06D7627a852592FE22dec59";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
