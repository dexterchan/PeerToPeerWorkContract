const fs=require("fs-extra");
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;


const filename = "testcalc.xml";


async function runtest(mypath){
    const xml = await fs.readFile(filename, 'utf8');
    const doc = new dom().parseFromString(xml);
    const nodes = xpath.select(mypath, doc);

    const items=[];
    for (n in nodes){
        //console.log("Node: " + nodes[n].toString());
        items.push( nodes[n].toString() );
    }
    const str = items.join("\n");
    return str;
}



async function test(){
    const MM=await runtest("/Result/Greek/SwapCurve/MoneyMarketQuotes/Quote");
    console.log("MM Rates")
    console.log(MM);
    const swaprates=await runtest("/Result/Greek/SwapCurve/SwapRates/Quote");
    console.log("SWAP Rates")
    console.log(swaprates);
}
test();