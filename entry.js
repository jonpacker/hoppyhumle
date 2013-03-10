var entry = require('./entry-model');
var async = require('async');
var naan = require('naan');
module.exports = function(title, tags, file, attrs, cb) {
  require('./db.js')(function(err, db) {
    if (err) return cb(err);
    var Entry = entry(db);
    var newEntry = { title: title, file: file };
    Object.keys(attrs).forEach(function(attr) { newEntry[attr] = attrs[attr] });
    
    async.waterfall([
      Entry.save.bind(Entry, newEntry),
      function(entry, cb) { 
        Entry.tag(entry, tags, function(err, rels) {
          cb(err, !err && entry);
        });
      },
    ], cb);
  });
};
