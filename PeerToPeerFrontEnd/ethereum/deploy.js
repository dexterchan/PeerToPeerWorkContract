const acct = require("./web3_transact").getAccount;
const web3 = require("./web3_transact").default;

async function testAcct(){
    const acctlist = await acct();
    console.log(acctlist);
}
//testAcct();
async function listWeb3Acct(){
    const acctlist = await web3.eth.getAccounts();
    console.log(acctlist);
}
listWeb3Acct();

const compiledFactoryABI=require("./buildV5/Peer2PeerProjectDashBoard.abi.json");
const compliedFactoryEVM=require("./buildV5/Peer2PeerProjectDashBoard.evm.json");


const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account",accounts[0]);
    const factory =new web3.eth.Contract(compiledFactoryABI);
    const result=await factory
        .deploy({data:"0x"+compliedFactoryEVM.bytecode.object})
        .send( {gas:5024164, from: accounts[0]}); //a bug on Throffle wallet with gas parameter
    
    console.log("Contract deployed to ", result.options.address);   
    
    const factoryContract = new web3.eth.Contract(compiledFactoryABI,result.options.address)
    const minCredit=10000;
    //Add members

    const mgr=accounts[0];
    const userList=["Pooh","Piglet","R2","Dumbo","IronMan"];
    
    try{
        const memembersPromise = await Promise.all(
            Array(parseInt(userList.length))
              .fill()
              .map((element, index) => {
                //console.log(userList[index]," begin");
                factoryContract.methods.addMember(accounts[index],userList[index],minCredit).send(
                    { from: mgr, gas:526747 }
                );
                //console.log(userList[index]," done");
              })
          );
    
    
    }catch(ex){
        console.log(ex.message);
    }
    console.log("DONE!");
    /*
    for (inx in userList){
        console.log(userList[inx]," begin");
        await factoryContract.methods.addMember(accounts[inx],userList[inx],minCredit).send(
            { from: mgr, gas:326747 }
        );
        console.log(userList[inx]," end");
    }
    run in parallel failed
    const memembersPromise = await Promise.all(
        Array(parseInt(userList.length))
          .fill()
          .map((element, index) => {
            console.log(userList[index]," begin");
            factoryContract.methods.addMember(mgr,userList[index],minCredit).send(
                { from: mgr, gas:326747 }
            );
            console.log(userList[index]," done");
          })
      );*/
      /*
    await factoryContract.methods.addMember(mgr,userList[0],minCredit).send(
        { from: mgr, gas:326747 }
    );;*/
    /*
    //CreateRSA.SelfSigned.OpenSSL.sh Pooh
    await factoryContract.methods.addMember(accounts[0],"Pooh",minCredit).send(
        { from: accounts[0], gas:326747 }
    );;


    
    //CreateRSA.SelfSigned.OpenSSL.sh Piglet
    await factoryContract.methods.addMember(accounts[1],"Piglet",minCredit).send(
        { from: accounts[0], gas:326747 }
    );;
    //CreateRSA.SelfSigned.OpenSSL.sh R2
    await factoryContract.methods.addMember(accounts[2],"R2",minCredit).send(
        { from: accounts[0], gas:326747 }
    );;
    //CreateRSA.SelfSigned.OpenSSL.sh Dumbo
    await factoryContract.methods.addMember(accounts[3],"Dumbo",minCredit).send(
        { from: accounts[0], gas:326747 }
    );;
    //CreateRSA.SelfSigned.OpenSSL.sh IronMan
    await factoryContract.methods.addMember(accounts[4],"IronMan",minCredit).send(
        { from: accounts[0], gas:326747 }
    );;
    */
    
};
deploy();