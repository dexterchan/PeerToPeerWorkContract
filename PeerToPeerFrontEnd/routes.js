const routes = require('next-routes')();
//require("next-routes") returns function object!!!

routes
    .add("/workcontract/new","/projects/new")
    .add("/workcontract/:address","projects/show")
    .add("/workcontract/:address/worklog","/projects/worklog/index")
    .add("/workcontract/:address/worklog/new","/projects/worklog/new")
    .add("/workcontract/:address/finance/:status","/projects/finance/new");

module.exports=routes;