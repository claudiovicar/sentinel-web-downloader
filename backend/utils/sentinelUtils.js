const path = require('path');

const SENTINEL2_TILES_DEST = process.env.SENTINEL2_TILES_DEST;

exports.getDestinationFolder = function(scene) {
  return path.join(SENTINEL2_TILES_DEST, scene.tile.id, scene.granule_id);
}