
const debug = require("debug")("app:DEBUG");

const SYS={
    ecashorder_url:{
        default:"http://localhost:8001/api/ecashorder"
    }
}


module.exports=(key)=>{
    let retValue;
    if(SYS[key]){
        let mode;
        if(process.env.NODE_ENV !== 'production'){
            mode="default";
        }
        debug(`System config Running in mode: ${mode}`)
        return SYS[key][mode];
    }
    return retValue;
}