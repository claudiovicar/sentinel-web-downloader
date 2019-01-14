var router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Okey' });
});

router.use('/geo', require('./api/geo'));
router.use('/sentinel/tiles', require('./api/sentinelTile'));
router.use('/sentinel/scenes', require('./api/sentinelScene'));

module.exports = router;