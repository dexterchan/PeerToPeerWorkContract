import web3 from './web3_query.js';

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");


const deployedAddress="0x6856604605cC012ddCa2fE34f26E06292b891deE";


export default new web3.eth.Contract(compiledFactoryABI,deployedAddress);
