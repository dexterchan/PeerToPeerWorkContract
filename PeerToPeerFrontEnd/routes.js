const routes = require('next-routes')();
//require("next-routes") returns function object!!!

routes
    .add("/workcontract/new","/projects/new")
    .add("/workcontract/:address","projects/show");

module.exports=routes;