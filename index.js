const express = require('express')
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
//make sure that api endpoint addresses start with /api/...
app.post('/api/reviews', function(req, res) {
    var make = req.body.make;
    var model = req.body.model;
});
