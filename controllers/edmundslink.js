var express = require('express'),
router = express.Router();
const bodyParser = require('body-parser');

router.post('/', function(req, res){
  res.send('https://www.edmunds.com/'+req.body.make +'/' + req.body.model);
})

module.exports = router;