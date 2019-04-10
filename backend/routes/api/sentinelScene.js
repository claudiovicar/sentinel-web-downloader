var router = require('express').Router();

const sentinelUtils = require('../../utils/sentinelUtils');
const tileDownloader = require('../../utils/sentinelTileDownloader');

const SentinelScene = require('../../models/SentinelScene');
const SentinelDownloadRequest = require('../../models/SentinelDownloadRequest').SentinelDownloadRequest;
const SentinelDownloadRequestGroup = require('../../models/SentinelDownloadRequest').SentinelDownloadRequestGroup;

router.param('id', function(req, res, next, id) {
  SentinelScene.findById(id).populate('tile').exec()
    .then(function (scene) {
      if (!scene) { return res.sendStatus(404); }

      req.scene = scene;

      return next();
    }).catch(next);
});

router.param('downloadRequestId', function(req, res, next, id) {
  SentinelDownloadRequest.findById(id).populate({
    path: 'scene',
    populate: {
      path: 'tile'
    }
  }).exec()
    .then(function (downloadRequest) {
      if (!downloadRequest) { return res.sendStatus(404); }

      req.downloadRequest = downloadRequest;

      return next();
    }).catch(next);
});

router.get('/dateRange', (req, res) => {

  Promise.all([
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: 1}).limit(1).exec(),
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: -1}).limit(1).exec()
  ]).then(function(results) {
    if (results && results.length)
      res.json({min: results[0].sensing_time, max: results[1].sensing_time});
    else
      res.sendStatus(500);
  })
  .catch((e) => {
    res.sendStatus(500);
  });

});

router.post('/filter', (req, res) => {

  SentinelScene.filter(req.body.tiles, req.body.dateRange, req.body.cloudCover)
    .then(function(scenes) {
      res.json(scenes);
    });

});

router.get('/:id/preview', (req, res) => {

  if (!req.scene) res.sendStatus(500);

  tileDownloader.downloadPreview(req.scene)
  .then((imagePath) => {
    console.log(imagePath);
    res.sendFile(imagePath);
  })
  .catch((e) => {
    res.sendStatus(500);
  });

});

router.post('/generateComposition', (req, res) => {

  if (!req.body.scenes) res.sendStatus(500);

  tileDownloader.downloadBands(req.body.scenes, req.body.outputFormat, req.body.bandComposition)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((e) => {
    console.error(e);
    res.sendStatus(500);
  });

});

router.get('/downloadStatus', (req, res) => {

  // SentinelDownloadRequest.find({})
  SentinelDownloadRequestGroup.find({})
  .sort({'request_date': -1})
  .populate({
    path: 'requests',
    populate: {
      path: 'scene',
      select: 'granule_id cloud_cover -_id'
    }
  })
  .then((requests) => {
    res.send(requests);
  })
  .catch((e) => {
    res.sendStatus(500);
  });

});

router.get('/download/:downloadRequestId', (req, res) => {

  if (!req.downloadRequest) res.sendStatus(500);

  const destinationFile = sentinelUtils.getSentinelRequestDestinationFile(req.downloadRequest);
  const fileName = req.downloadRequest.scene.granule_id + '_' +
    req.downloadRequest.bands.toString().split(',').join('_') +
    '.' + req.downloadRequest.outputFormat;

  res.download(destinationFile, fileName);

});

router.post('/downloadList', (req, res) => {

  if (!req.body.scenes) res.sendStatus(500);

  // Obter as cenas do banco e devolver um CSV com os campos de interesse

  res.sendStatus(200);

});

module.exports = router;