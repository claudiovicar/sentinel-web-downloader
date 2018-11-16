var mongoose = require('mongoose');

var SentinelTile = require('./SentinelTile');

var SentinelSceneSchema = new mongoose.Schema({
  granule_id: {type: String},
  product_id: {type: String},
  datatake_identifier: {type: String},
  tile: { type: mongoose.Schema.Types.ObjectId, ref: 'SentinelTile' },
  sensing_time: {type: Date},
  total_size: {type: Number},
  cloud_cover: {type: String},
  geometric_quality_flag: {type: String},
  generation_time: {type: String},
  north_lat: {type: Number},
  south_lat: {type: Number},
  west_lon: {type: Number},
  east_lon: {type: Number},
  base_url: {type: String}
});

SentinelSceneSchema.index({sensing_time: 1});

var SentinelScene = mongoose.model('SentinelScene', SentinelSceneSchema);

module.exports = SentinelScene;