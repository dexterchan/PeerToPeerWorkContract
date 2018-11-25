
const logfunc=(req,res,next)=>{
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Logging.... ${req.method} ${req.path} from ${ip}`);
    next();
};

module.exports=logfunc;