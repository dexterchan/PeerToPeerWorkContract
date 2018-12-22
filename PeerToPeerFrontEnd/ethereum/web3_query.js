import Web3 from "web3";

//still use metamask
//However, below code of 
//const web3 = new Web3(window.web3.currentProvider);
//will NOT work in "Next server"
//Reason: Next server can not prepare javascript to initialize "window" component as client browser
//const web3 = new Web3(window.web3.currentProvider);

let web3 //let keyword means re-assign of variable

//check if we are running in client
if(typeof window !== "undefined" && typeof window.web3!=="undefined"){
    //We are running in browser and metamask is running in browser
    web3 = new Web3(window.web3.currentProvider);
}else{
    //We are not in browser or metamask is not running in browser
    const provider = new Web3.providers.HttpProvider(
        //http connection point of ethereum node hosted by infura
        'https://rinkeby.infura.io/v3/ddae119e519b4ed9b2d16eea07ab3498'
    );
    web3 = new Web3(provider);
}

export default web3;