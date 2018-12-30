
const debug = require("debug")("app:DEBUG");

const SYS={
    ecashorder_url:{
        default:"http://localhost:8001/api/ecashorder",
        development:"http://localhost:8001/api/ecashorder",
        SIT:"http://192.168.1.251:8001/api/ecashorder",
        UAT:"http://dexcloudapp.xyz:8888/api/ecashorder"
    }
}


module.exports=(key)=>{
    let retValue;
    if(SYS[key]){
        let mode;
        
        mode = process.env.RUN_ENV;
        if(mode.length==0){
            mode="default";
        }
        
        debug(`System config Running in mode: ${mode} ${SYS[key][mode]}`)
       
        return SYS[key][mode];
    }
    return retValue;
}