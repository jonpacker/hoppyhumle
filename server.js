var express = require('express');
var db = require('./db');
var app = express();

db(function(err, db) {
  if (err) throw err;

  require('./routes')(app, db);
  app.listen(5892, function() {
    console.log("Listening on 5892.");
  });
});
