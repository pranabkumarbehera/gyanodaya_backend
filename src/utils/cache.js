const NodeCache = require("node-cache");

const appCache = new NodeCache({ stdTTL: 120, checkperiod: 150 });

module.exports = appCache;
