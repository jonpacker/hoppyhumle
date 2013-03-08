var model = require('seraph-model');
var slug = require('slug');
module.exports = function(db) {
  var Entry = model(db, 'entry');
  
  Entry.on('prepare', function addSlug(entry, cb) {
    if (!entry.title) return cb(new Error('Entry must have a title :/'));
    cb(null, entry.slug = slug(entry.title), entry);
  });

  Entry.on('prepare', function addTimestamp(entry, cb) {
    cb(null, entry.timestamp = Date.now(), entry);
  })

  Entry.on('index', function(entry, cb) {
    db.index('entries', entry, 'slug', entry.slug, cb);
  });

  return Entry;
};
