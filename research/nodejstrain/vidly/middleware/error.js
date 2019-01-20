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