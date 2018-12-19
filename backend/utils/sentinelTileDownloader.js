const fileUtils = require('./fileUtils');
const manifestUtils = require('./manifestUtils');
const sentinelUtils = require('./sentinelUtils');

const SentinelScene = require('../models/SentinelScene');
const SentinelDownloadRequest = require('../models/SentinelDownloadRequest');

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const BAND_IMG_NAME = 'BANDA_';
const COMPOSITION_IMG_NAME = 'COMPOSITION_';
const PREVIEW_IMG_NAME = 'preview.jpg';
const PREVIEW_TMP_IMG_NAME = 'preview.jp2';

async function downloadBands(scenes, composition = [4,3,2]) {

  for (let index = 0; index < scenes.length; index++) {
    const scene = await SentinelScene.findById(scenes[index]._id).populate('tile').exec();

    new SentinelDownloadRequest({bands: composition, scene}).save();

  }

  downloadBandImages();

}

async function downloadBandImages() {

  const queuedRequests = await SentinelDownloadRequest.find({status: 'QUEUED'})
    .populate({
      path: 'scene',
      populate: {
        path: 'tile'
      }
    })
    .exec();
  if (!queuedRequests.length) return;

  queuedRequests.forEach(request => {

    downloadAndGenerateBandComposition(request);

  });

}

async function downloadAndGenerateBandComposition(downloadRequest) {

  downloadRequest.status = 'IN_PROGRESS';
  await downloadRequest.save();

  const destinationFile = path.join(sentinelUtils.getDestinationFolder(downloadRequest.scene), COMPOSITION_IMG_NAME + bands.toString().split(',').join('_') + '.img');

  if (fs.existsSync(destinationFile)) {
    downloadRequest.status = 'DONE';
    await downloadRequest.save();
  }

  let bandPromises = [];
  const bands = downloadRequest.bands.split(',').map(b => Number(b));
  let downloadedBandPaths = []
  bands.forEach((bandNumber) => {
    const bandURL = manifestUtils.getResourceURL(downloadRequest.scene, 'IMG_DATA', `B0${bandNumber}.jp2`);
    const destFile = path.join(sentinelUtils.getDestinationFolder(downloadRequest.scene), BAND_IMG_NAME + bandNumber + '.jp2');
    downloadedBandPaths.push(destFile);
    bandPromises.push(fileUtils.download(bandURL, destFile, {skip: true}));
  });

  return Promise.all(bandPromises)
    .then(() => {
      let comandoGDAL = `gdal_merge.py -separate -of HFA -o ${destinationFile} `;
      downloadedBandPaths.forEach((bandPath) => {
        comandoGDAL += bandPath + ' ';
      });

      console.log(`Executando comando GDAL: ${comandoGDAL}`);
      exec(comandoGDAL, function(err, stdout, stderr) {
        if(err || stderr) {
          console.log('Erro ao gerar composição de bandas ' + (err || stderr));
          downloadRequest.status = 'ERROR';
        }
        else {
          console.log('Composição de bandas gerada com sucesso');
          downloadRequest.status = 'DONE';
        }
        downloadRequest.save();
      });

      // const translate = 'gdal_translate -ot Byte -scale -of HFA arq_temp arq_final';
    })
    .catch(e => {
      console.log(e);
    });

}

function downloadPreview(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), PREVIEW_IMG_NAME);

  if (fs.existsSync(destinationFile)) {
    return new Promise((resolve, reject) => {
      resolve(destinationFile);
    });
  }

  return manifestUtils.downloadManifest(scene)
    .then(() => {
      return downloadPreviewImage(scene);
    });

}

function downloadPreviewImage(scene) {

  const tempPreviewFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_TMP_IMG_NAME);
  const destinationFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_IMG_NAME);

  const previewURL = manifestUtils.getResourceURL(scene, 'Preview');

  return fileUtils.download(previewURL, tempPreviewFile, {})
    .then(() => {

      return new Promise((resolve, reject) => {

        exec(`gdal_translate -of PNG -a_nodata 0 ${tempPreviewFile} ${destinationFile}`, function(err, stdout, stderr) {

          if(err || stderr) {
            console.log('Erro ao converter JP2 para PNG ' + (err || stderr));
            reject();
          }

          resolve(destinationFile);

        });

      });

    })
    .catch(e => {
      console.log(e);
    });

}

function createDestinationFolder(scene) {

  const destFolder = sentinelUtils.getDestinationFolder(scene);

  fileUtils.createFolder(destFolder);

  return destFolder;

}

module.exports = {downloadPreview, downloadBands};