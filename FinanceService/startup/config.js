const config = require("config");

module.exports=()=>{
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey not defined in env variable financeService_jwtPrivateKey');
        process.exit(1);
    }
}