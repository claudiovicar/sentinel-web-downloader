var router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

router.use('/geo', require('./api/geo'));
router.use('/sentinel', require('./api/sentinel'));

module.exports = router;