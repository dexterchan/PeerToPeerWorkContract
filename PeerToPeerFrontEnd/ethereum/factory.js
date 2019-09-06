import web3 from "./web3_query.js";

const compiledFactoryABI = require("./buildV5/Peer2PeerProjectDashBoard.abi.json");

const deployedAddress = "0xBb43387651BCE527059236Ce1B6717A661331Df6";

export default new web3.eth.Contract(compiledFactoryABI, deployedAddress);
