var model = require('seraph-model');
var tag = require('./tag-model');
var slug = require('slug');
var async = require('async');

module.exports = function(db) {
  var Entry = model(db, 'entry');
  var Tag = tag(db);
  
  Entry.on('prepare', function addSlug(entry, cb) {
    if (!entry.title) return cb(new Error('Entry must have a title :/'));
    cb(null, (entry.slug = slug(entry.title), entry));
  });

  Entry.on('prepare', function addTimestamp(entry, cb) {
    cb(null, (entry.timestamp = Date.now(), entry));
  })

  Entry.on('index', function(entry, cb) {
    db.index('entries', entry, 'slug', entry.slug, cb);
  });

  Entry.tag = function(entry, tags, cb) {
    function tagEntryWith(tag, cb) {
      var getTagObj = function(cb) {
        Tag.read(tag, function(err, tag) {
          if (err) return cb(err);
          else if (tag) return cb(null, tag);
          Tag.save(tag, cb);
        })
      };
      getTagObj(function(err, tag) {
        if (err) return cb(err);
        db.relate(entry, 'tagged_with', tag, cb);
      });
    }

    async.map(tags, tagEntryWith, cb);
  };

  return Entry;
};
