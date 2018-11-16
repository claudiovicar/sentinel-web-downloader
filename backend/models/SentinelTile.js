var mongoose = require('mongoose');

var SentinelTileSchema = new mongoose.Schema({
  id: {type: String, unique: true}
});

SentinelTileSchema.index({id: 1});

var SentinelTile = mongoose.model('SentinelTile', SentinelTileSchema);

module.exports = SentinelTile;