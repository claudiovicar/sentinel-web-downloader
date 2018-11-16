var router = require('express').Router();

var SentinelScene = require('../../models/SentinelScene');
var SentinelTile = require('../../models/SentinelTile');

router.get('/list/tiles', (req, res) => {

  SentinelTile.find({}).select('id').sort({id: 1}).exec(function(err, results) {
    res.json(results);
  });

});

module.exports = router;