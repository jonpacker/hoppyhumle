var model = require('seraph-model');
var slug = require('slug');
module.exports = function(db) {
  var Entry = model(db, 'entry');
  
  Entry.on('prepare', function(entry, cb) {
    if (!entry.title) return cb(new Error('Entry must have a title :/'));
    entry.slug = slug(entry.title);
  });

  Entry.on('index', function(entry, cb) {
    db.index('entries', entry, 'slug', entry.slug, cb);
  });

  return Entry;
};
