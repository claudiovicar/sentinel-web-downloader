const path = require('path');

const SENTINEL2_TILES_DEST = process.env.SENTINEL2_TILES_DEST;
const COMPOSITION_IMG_NAME = 'COMPOSITION_';

function getDestinationFolder(scene) {
  return path.join(SENTINEL2_TILES_DEST, scene.tile.id.toString(), scene.granule_id);
}

exports.getSentinelRequestDestinationFile = function(sentinelDownloadRequest, options = {}) {

  const tmpSuffix = options.tmp ? '_tmp' : '';

	return path.join(
		getDestinationFolder(sentinelDownloadRequest.scene),
    COMPOSITION_IMG_NAME +
    sentinelDownloadRequest.bands.toString().split(',').join('_') +
    tmpSuffix +
    '.' +
    sentinelDownloadRequest.outputFormat);

}

exports.getDestinationFolder = getDestinationFolder;