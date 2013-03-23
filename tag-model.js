var model = require('seraph-model');
module.exports = function(db) {
  var Tag = model(db, 'tag');
  Tag.for = function(entry, cb) {
    var cypher = [
      "START tag=" + Tag.cypherStart() + ", entry=node({entryId})",
      "MATCH (entry)-[:tagged_with]->(tag)", 
      "RETURN tag"
    ].join(" ");
    Tag.db.query(cypher, {entryId: entry.id}, cb);
  };
  return Tag;
};
