const http=require("http");

//A event emitter server

module.exports=(port)=>{
    const webserver=http.createServer(
        (req,res)=>{
            if(req.url=="/"){
                res.write("Hello, eggegg");
                res.end();
            }
            if(req.url=="/api/courses"){
                res.write(JSON.stringify([1,2,3]));
                res.end();
            }
        }
    );
    /*
    webserver.on("connection",(socket)=>{
        console.log("new connection...");
    });*/
    webserver.listen(port);
    console.log(`Listening on port ${port}....`);
};