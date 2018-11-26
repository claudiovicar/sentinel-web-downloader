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

/**
 * Sample granule_id: L1C_T18MXB_A017711_20181112T151659, ou S2A_OPER_MSI_L1C_TL_SGS__20151217T194403_A002538_T20KQU_N02.01
 */
SentinelSceneSchema.methods.getSceneInfo = function() {

  console.log(this.granule_id);

  const reTiles = /T(\d{2})(\w{1})(\w{2})/;
  const reDate = /(\d{4})(\d{2})(\d{2})/;

  let results = getTileInfoFromGranuleId(this.granule_id).split(reTiles);

  const utm = results[1];
  const latitude = results[2];
  const square = results[3];

  results = getDateInfoFromGranuleId(this.granule_id).split(reDate);

  const year = results[1];
  const month = results[2];
  const day = results[3];

  return {utm, latitude, square, year, month, day};

};

function getTileInfoFromGranuleId(granuleId) {
  if (granuleId.startsWith('L1C')) {
    return granuleId.split('_')[1];
  } else if (granuleId.startsWith('S2A')) {
    return granuleId.split('_')[9];
  }
}

function getDateInfoFromGranuleId(granuleId) {
  if (granuleId.startsWith('L1C')) {
    return granuleId.split('_')[3];
  } else if (granuleId.startsWith('S2A')) {
    return granuleId.split('_')[7];
  }
}


var SentinelScene = mongoose.model('SentinelScene', SentinelSceneSchema);

SentinelScene.filter = function(tiles, dateRange, cloudCover) {

  return this.model('SentinelScene')
    .find({
      tile: { '$in': tiles },
      sensing_time: { $gte: new Date(dateRange.min), $lte: new Date(dateRange.max) },
      cloud_cover: { $lt: cloudCover }
    })
    .populate('tile')
    .select('product_id cloud_cover sensing_time tile.id')
    .sort({'sensing_time': 1})
    .exec();

};

// SentinelScene.aggregate([
//   {$group: {_id: '$tile.id', tiles: {$push: "$tile"}}}
// ]);

module.exports = SentinelScene;