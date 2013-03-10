var express = require('express');
var stylus = require('stylus')
var nib = require('nib');
var db = require('./db');
var app = express();

function compileStylus(str, path) {
  return stylus(str).set('filename', path).use(nib());
};

db(function(err, db) {
  if (err) throw err;

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(stylus.middleware({ 
    src: __dirname + '/public/css/', 
    compile: compileStylus 
  }));
  app.use(express.static(__dirname + '/public'));

  require('./routes')(app, db);
  app.listen(5892, function() {
    console.log("Listening on 5892.");
  });
});
