const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
var port = process.env.PORT | 3000;
const nextapp = next({
    dev: process.env.NODE_ENV !== 'production'
    //ask our app to look for global env variable "NODE_ENV"
});

const routes = require('./routes');
const handler = routes.getRequestHandler(nextapp);

/*
if( port == undefined){
    port=3000;
}*/

/*
// Without express
const {createServer}=require("http");
nextapp.prepare().then(() => {
  createServer(handler).listen(port,
  (err)=>{
      if (err) throw err;
      console.log("Ready on localhost port:"+port);
  });
})
*/
nextapp.prepare().then(() => {
    // express code here
    const app = express()
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api/ethwebservice', require('./routes/ethWebService')) ;
    app.get('*', (req,res) => {
        return handler(req,res) // for all the react stuff
    })
    app.listen(port, err => {
        if (err) throw err;
        console.log(`ready at http://localhost:${port}`)
    })
})