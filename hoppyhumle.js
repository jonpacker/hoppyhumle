var express = require('express');
var stylus = require('stylus')
var nib = require('nib');
var db = require('./db');
var app = express();

function compileStylus(str, path) {
  return stylus(str).set('filename', path).use(nib());
};

module.exports = function(config) {
  db(function(err, db) {
    if (err) throw err;

    app.set('views', config.dirs.routes);
    app.set('view engine', 'jade');
    if (config.logger) app.use(express.logger(config.logger));
    app.use(stylus.middleware({ 
      src: config.dirs.stylus, 
      compile: compileStylus 
    }));
    app.use(express.static(config.dirs.pub));

    require(config.dirs.routes)(app, db);
    app.listen(config.port, function() {
      console.log("Listening on", config.port);
    });
  });
});
