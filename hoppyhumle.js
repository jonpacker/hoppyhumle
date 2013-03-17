var express = require('express');
var stylus = require('stylus')
var nib = require('nib');
var db = require('./db');
var path = require('path');

function compileStylus(str, path) {
  return stylus(str).set('filename', path).use(nib());
};

module.exports = function(config, cb) {
  db(function(err, db) {
    if (err) return cb(err);

    db.models = {
      entry: require('./entry-model')(db),
      tag: require('./tag-model')(db)
    };
    
    config.pubdir = path.resolve(config.pubdir);

    var app = express();
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    if (config.logger) app.use(express.logger(config.logger));
    app.use(stylus.middleware({ 
      src: path.join(config.pubdir, 'css'), 
      compile: compileStylus 
    }));
    app.use(express.static(config.pubdir));

    require('./routes')(app, db);
    cb(null, app);
  });
};
