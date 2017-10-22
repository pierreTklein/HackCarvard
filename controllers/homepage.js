var express = require('express'),
router = express.Router();
const bodyParser = require('body-parser');

router.get('/', function (req, res) {
  res.send('Please check out Hack Harvard')
})

module.exports = router;