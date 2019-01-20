const config = require('config');
const {logger} = require("./logging");
module.exports=()=>{
    if (!config.get('jwtPrivateKey')) {
        
        throw new Error('FATAL ERROR: jwtPrivateKey:vidly_jwtPrivateKey is not defined.');
        //process.exit(1);
    }
}