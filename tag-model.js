var model = require('seraph-model');
module.exports = function(db) {
  var Tag = model(db, 'tag');
  return Tag;
};
