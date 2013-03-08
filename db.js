var seraph = require('seraph'),
    nvm = require('neo4j-vm'),
    nsv = require('neo4j-supervisor'),
    async = require('async'),
    naan = require('naan');

module.exports = function(cb) {
  async.waterfall([
    function getNeoInstall(cb) { nvm('1.9.M05', 'community', cb) },
    function createSupervisor(loc, cb) { cb(null, nsv(loc)) },
    function setPort(neo, cb) { naan.b.wrap(neo, neo.port, neo)(42851, cb) },
    function start(neo, cb) { naan.b.wrap(neo, neo.start, neo)(cb) },
    function getEndpoint(neo, cb) { neo.endpoint(cb) },
    function createSeraph(ep, cb) { cb(null, seraph(ep)) }
  ], cb);
};
