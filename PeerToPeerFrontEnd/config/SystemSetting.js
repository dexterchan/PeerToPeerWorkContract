const debug = require("debug")("app:DEBUG");

const SYS = {
  ecashorder_url: {
    default: "http://apiapp.xyz/api/ecashorder/",
    development: "http://localhost:8001/api/ecashorder/",
    SIT: "http://192.168.1.251:8001/api/ecashorder/",
    UAT: "http://apiapp.xyz:8888/api/ecashorder/",
    K8: "http://apiapp.xyz/api/ecashorder/"
  }
};

module.exports = key => {
  let retValue;
  if (SYS[key]) {
    let mode;

    mode = process.env.RUN_ENV;
    debug(`System config plan to run in mode: ${mode} ${SYS[key][mode]}`);
    if (mode == undefined || mode.length == 0) {
      mode = "default";
    }
    debug(`System config Running in mode: ${mode} ${SYS[key][mode]}`);

    return SYS[key][mode];
  }
  return retValue;
};
