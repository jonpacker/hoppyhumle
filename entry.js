var entry = require('./entry-model');
var async = require('async');
module.exports = function(title, tags, file, attrs, cb) {
  require('./db.js')(function(err, db) {
    console.log("Hallo i am a db")
    if (err) return cb(err);
    var Entry = entry(db);
    var newEntry = { title: title, file: file };
    Object.keys(attrs).forEach(function(attr) { newEntry[attr] = attrs[attr] });
    
    async.series([
      Entry.save.bind(Entry, newEntry),
      Entry.tag.bind(Entry, newEntry, tags)
    ], function(err, stuff) {
      console.log("Finished!", err, stuff);
    });
  });
};
