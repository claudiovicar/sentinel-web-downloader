var mongoose = require('mongoose');

var SentinelSchema = new mongoose.Schema({
  granule_id: {type: String},
  product_id: {type: String},
  datatake_identifier: {type: String},
  tile_id: {type: String},
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

// ArticleSchema.methods.toJSONFor = function(user){
//   return {
//     slug: this.slug,
//     title: this.title,
//     description: this.description,
//     body: this.body,
//     createdAt: this.createdAt,
//     updatedAt: this.updatedAt,
//     tagList: this.tagList,
//     favorited: user ? user.isFavorite(this._id) : false,
//     favoritesCount: this.favoritesCount,
//     author: this.author.toProfileJSONFor(user)
//   };
// };

var Sentinel = mongoose.model('Sentinel', SentinelSchema);

module.exports = Sentinel;