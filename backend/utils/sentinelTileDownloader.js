const fileUtils = require('./fileUtils');
const manifestUtils = require('./manifestUtils');
const sentinelUtils = require('./sentinelUtils');

const SentinelScene = require('../models/SentinelScene');
const SentinelDownloadRequest = require('../models/SentinelDownloadRequest').SentinelDownloadRequest;
const SentinelDownloadRequestGroup = require('../models/SentinelDownloadRequest').SentinelDownloadRequestGroup;

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const BAND_IMG_NAME = 'BANDA_';
const PREVIEW_IMG_NAME = 'preview.png';
const PREVIEW_TMP_IMG_NAME = 'preview.jp2';

const DEFAULT_SRS = 'EPSG:4674';

// Maps human-readable extensions to GDAL's format names
const GDAL_OUTPUT_FORMATS = {
  'img': 'HFA',
  'tiff': 'GTIFF'
};

let previewQueue = {};
const PREVIEW_THROTTLE = 8;

async function downloadBands(scenes, outputFormat = 'img', bandComposition = [4,3,2]) {

  const requestGroup = new SentinelDownloadRequestGroup();

  for (let index = 0; index < scenes.length; index++) {
    const scene = await SentinelScene.findById(scenes[index]._id).populate('tile').exec();

    const request = await new SentinelDownloadRequest({bands: bandComposition.toString(), outputFormat, scene}).save()
    requestGroup.requests.push(request);
  }

  requestGroup.save();

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

  for (let index = 0; index < queuedRequests.length; index++) {
    const request = queuedRequests[index];
    await downloadAndGenerateBandComposition(request);
  }

}

async function downloadAndGenerateBandComposition(downloadRequest) {

  downloadRequest.status = 'IN_PROGRESS';
  await downloadRequest.save();

  const destinationFile = sentinelUtils.getSentinelRequestDestinationFile(downloadRequest);

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
    // bandPromises.push(fileUtils.download(bandURL, destFile, {skip: true}));
    bandPromises.push(fileUtils.downloadFromGoogleCloud(bandURL, destFile, {skip: true}));
  });

  return Promise.all(bandPromises)
    .then(() => {
      generateFile(downloadRequest, downloadedBandPaths);
    })
    .catch(e => {
      console.log(e);
    });

}

async function generateFile(downloadRequest, downloadedBandPaths) {

  const tempDestinationFile = sentinelUtils.getSentinelRequestDestinationFile(downloadRequest, {tmp: true});
  const destinationFile = sentinelUtils.getSentinelRequestDestinationFile(downloadRequest);

  const outputFormat = GDAL_OUTPUT_FORMATS[downloadRequest.outputFormat];

  let comandoGDALMerge = `gdal_merge.py -separate -of ${outputFormat} -o ${tempDestinationFile} `;
  downloadedBandPaths.forEach((bandPath) => {
    comandoGDALMerge += bandPath + ' ';
  });

  let comandoGDALWarp = `gdalwarp -of ${outputFormat} -t_srs "${DEFAULT_SRS}" ${tempDestinationFile} ${destinationFile}`;

  await runGDALCommand(comandoGDALMerge, downloadRequest);
  await runGDALCommand(comandoGDALWarp, downloadRequest);

  removeTemporaryFiles(tempDestinationFile, downloadedBandPaths);

}

async function runGDALCommand(gdalCommand, downloadRequest) {

  console.log(`Executando comando GDAL: ${gdalCommand}`);
  return new Promise((resolve, reject) => {

    exec(gdalCommand, function(err, stdout, stderr) {
      if(err || stderr) {
        console.log('Erro ao gerar composição de bandas ' + (err || stderr));
        downloadRequest.status = 'ERROR';
      }
      else {
        console.log('Composição de bandas gerada com sucesso');
        downloadRequest.status = 'DONE';
      }
      return downloadRequest.save()
        .then(resolve)
        .catch(reject);
    });

  });

}

// Agenda requisições para não ser bloqueado pelo Google Cloud Storage
function queueDownloadPreview(scene) {

  if(!previewQueue[scene._id]) {
    previewQueue[scene._id] = scene;
  }

  return downloadPreview(scene);

}

function downloadPreview(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), PREVIEW_IMG_NAME);

  if (fs.existsSync(destinationFile)) {
    return new Promise((resolve, reject) => {
      resolve(destinationFile);
    });
  }

  // Permite, no máximo, PREVIEW_THROTTLE requisições simultâneas
  if(Object.keys(previewQueue).length >= PREVIEW_THROTTLE) {
    let interval = setInterval(() => {
      if(Object.keys(previewQueue).length < PREVIEW_THROTTLE || !previewQueue[scene._id]) {
        clearInterval(interval);
      } else {
        console.log(`Cena ${scene._id} está esperando para ter o preview baixado.`);
      }
    }, 2000);
  }

  console.log(`Baixando preview da cena ${scene._id}`);

  return manifestUtils.downloadManifest(scene)
    .then(() => {
      return downloadPreviewImage(scene);
    });

}

function downloadPreviewImage(scene) {

  const tempPreviewFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_TMP_IMG_NAME);
  const destinationFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_IMG_NAME);

  const previewURL = manifestUtils.getResourceURL(scene, 'Preview');

  return fileUtils.downloadFromGoogleCloud(previewURL, tempPreviewFile, {})
    .then(() => {

      return new Promise((resolve, reject) => {

        exec(`gdal_translate -of PNG -a_nodata 0 ${tempPreviewFile} ${destinationFile}`, function(err, stdout, stderr) {

          if(err || stderr) {
            console.log('Erro ao converter JP2 para PNG ' + (err || stderr));
            // reject();
          }

          delete previewQueue[scene._id];

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

function removeTemporaryFiles(tempComposition, bands) {

  console.info('Removendo arquivos temporários...');

  fs.unlinkSync(tempComposition);

  bands.forEach(band => {
    fs.unlinkSync(band);
  });

}

module.exports = {queueDownloadPreview, downloadBands};
