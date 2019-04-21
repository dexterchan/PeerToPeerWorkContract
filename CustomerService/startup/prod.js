const Helmet = require("helmet");
const compression = require("compression");

module.exports = () => {
  app.use(Helmet());
  app.use(compression());
};
