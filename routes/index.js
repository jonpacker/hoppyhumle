var async = require('async');
module.exports = function(app, db) {
  app.get('/', function(req, res) {
    async.waterfall([
      db.models.entry.paginatedFetch.bind(this, 0, 5),
      db.models.entry.fetchContent,
    ], function(err, entries) {
      if (err) return res.send(500, err);
      console.log(entries);
      res.render('index', { entries: entries });
    });
  });
};
