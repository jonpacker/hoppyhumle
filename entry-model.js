var model = require('seraph-model');
var tag = require('./tag-model');
var slug = require('slug');
var async = require('async');
var getit = require('getit');

module.exports = function(db) {
  var Entry = model(db, 'entry');
  var Tag = tag(db);
  
  Entry.on('prepare', function addSlug(entry, cb) {
    if (!entry.title) return cb(new Error('Entry must have a title :/'));
    cb(null, (entry.slug = slug(entry.title).toLowerCase(), entry));
  });

  Entry.on('prepare', function addTimestamp(entry, cb) {
    cb(null, (entry.timestamp = Date.now(), entry));
  })

  Entry.on('index', function(entry, cb) {
    db.index('entries', entry, 'slug', entry.slug, cb);
  });

  Entry.tag = function(entry, tags, cb) {
    function tagEntryWith(tag, cb) {
      tag = {tag:tag};
      var getTagObj = function(cb) {
        Tag.where(tag, function(err, tagObj) {
          if (err) return cb(err);
          else if (tagObj.length > 0) return cb(null, tagObj);
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

  Entry.paginatedFetch = function(start, count, cb) {
    db.query([
      "START node = " + Entry.cypherStart(),
      "RETURN node",
      "ORDER BY node.timestamp DESC",
      "SKIP " + parseInt(start, 10),
      "LIMIT " + parseInt(count, 10)
    ].join(" "), cb);
  };

  Entry.fetchContent = function(entry, cb) {
    if (Array.isArray(entry)) {
      return async.map(entry, Entry.fetchContent, cb);
    }

    getit(entry.file, function(err, data) {
      if (err) return cb(err);
      cb(null, (entry.content = data, entry));
    });
  };

  return Entry;
};
