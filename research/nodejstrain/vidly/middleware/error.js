const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;


const logger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logfile.log' })
    ]
  });

  
module.exports.logger=logger;


module.exports.error=(err,req,res,next)=>{
    logger.log({level: 'error',message:err.message});

    //error
    //warn
    //info
    //verbose
    //debug
    //silly
    res.status(500).send("Error:"+err.message);
}