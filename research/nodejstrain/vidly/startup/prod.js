const helmet = require("helmet");
const compression = require("compression");

module.export= (app) =>{
    app.use(helmet());
    app.use(compression());
};