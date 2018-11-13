/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.json({'msg': 'ok'});
  // res.render('home', {
  //   title: 'Home'
  // });
};
