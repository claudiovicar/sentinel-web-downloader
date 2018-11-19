var mongoose = require('mongoose');

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

SentinelScene.filter = function(tiles, dateRange, cloudCover) {

  return this.model('SentinelScene')
    .find({
      tile: { '$in': tiles },
      sensing_time: { $gte: new Date(dateRange.min), $lte: new Date(dateRange.max) },
      cloud_cover: { $lt: cloudCover }
    })
    .populate('tile')
    .select('product_id cloud_cover sensing_time tile.id base_url')
    .sort({'sensing_time': 1})
    .exec();

};

// SentinelScene.aggregate([
//   {$group: {_id: 'tile.id'}}
// ]);

module.exports = SentinelScene;