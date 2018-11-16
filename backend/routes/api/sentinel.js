var router = require('express').Router();

var SentinelScene = require('../../models/SentinelScene');
var SentinelTile = require('../../models/SentinelTile');

router.get('/tiles/list', (req, res) => {

  SentinelTile.find({}).select('id').sort({id: 1}).exec(function(err, results) {
    res.json(results);
  });

});
var SentinelTile = require('../../models/SentinelTile');

router.get('/dateRange', (req, res) => {

  Promise.all([
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: 1}).limit(1).exec(),
    SentinelScene.findOne({}).select('id sensing_time').sort({sensing_time: -1}).limit(1).exec()
  ]).then(function(results) {
    res.json({min: results[0].sensing_time, max: results[1].sensing_time});
  });

});

module.exports = router;