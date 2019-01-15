var mongoose = require('mongoose');

var SentinelTileSchema = new mongoose.Schema({
  id: {type: String, unique: true}
});

SentinelTileSchema.index({id: 1});

SentinelTileSchema.static('findOneOrCreate', async function findOneOrCreate(query, document) {
  const found = await this.findOne(query);
  return found || this.create(document);
});

var SentinelTile = mongoose.model('SentinelTile', SentinelTileSchema);

module.exports = SentinelTile;