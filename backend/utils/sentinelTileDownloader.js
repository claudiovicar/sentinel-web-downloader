const fileUtils = require('./fileUtils');
const sentinelUtils = require('./sentinelUtils');

const path = require('path');
const fs = require('fs');

const PREVIEW_IMG_NAME = 'preview.jpg';

// SENTINEL2_PREVIEW_IMAGE=https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/{utm}/{latitude}/{square}/{year}/{month}/{day}/0/preview.jpg

function downloadPreview(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), PREVIEW_IMG_NAME);

  if (fs.existsSync(destinationFile)) {
    return new Promise((resolve, reject) => {
      resolve(destinationFile);
    });
  }

  const {utm, latitude, square, year, month, day} = scene.getSceneInfo();

  const previewURL = `https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/${utm}/${latitude}/${square}/${year}/${month}/${day}/0/preview.jpg`;

  console.log(previewURL);

  return fileUtils.download(previewURL, destinationFile);

}

function createDestinationFolder(scene) {

  const destFolder = sentinelUtils.getDestinationFolder(scene);

  fileUtils.createFolder(destFolder);

  return destFolder;

}

module.exports = {downloadPreview};