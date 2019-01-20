const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;


const logger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
      new transports.Console()
    ]
  });

  
module.exports.logger=logger;


module.exports.error=(err,req,res,next)=>{
    logger.log({level: 'error',message:err.message});
    res.status(500).send("Error:"+err.message);
}