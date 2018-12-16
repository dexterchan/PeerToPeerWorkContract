const routes = require('next-routes')();
//require("next-routes") returns function object!!!

routes
    .add("/projects/new","/projects/new");

module.exports=routes;