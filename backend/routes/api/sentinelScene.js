var router = require('express').Router();

const tileDownloader = require('../../utils/sentinelTileDownloader');

const SentinelScene = require('../../models/SentinelScene');
const SentinelDownloadRequest = require('../../models/SentinelDownloadRequest');

router.param('id', function(req, res, next, id) {
  SentinelScene.findById(id).populate('tile').exec()
    .then(function (scene) {
      if (!scene) { return res.sendStatus(404); }

      req.scene = scene;

      return next();
    }).catch(next);
});

router.get('/dateRange', (req, res) => {

  Promise.all([
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: 1}).limit(1).exec(),
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: -1}).limit(1).exec()
  ]).then(function(results) {
    res.json({min: results[0].sensing_time, max: results[1].sensing_time});
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
    // console.log(e);
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
    res.sendStatus(500);
  });

});

router.get('/downloadStatus', (req, res) => {

  SentinelDownloadRequest.find({})
  .populate({
    path: 'scene',
  select: 'granule_id cloud_cover -_id'})
  .then((requests) => {
    res.send(requests);
  })
  .catch((e) => {
    res.sendStatus(500);
  });

});

module.exports = router;