const express = require('express')
const bodyParser = require('body-parser');
const cheerio = require('cheerio')
const request = require('request');

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.get('/', function(req, res) {
  res.send('Hello World!')
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

//make sure that api endpoint addresses start with /api/...
// app.post('/api/reviews', function(req, res) {
//     var make = req.body.make;
//     var model = req.body.model;
// });


// GET CAR PRICES

app.get('/api/getstats', function(req, res) {

  var make1 = 'Ford'
  var make2 = 'Explorer'

  var car = 'https://www.google.com/search?q=' + make1 + '+' + make2 + '+' + 'price'

  function getPrice(url) {
    request(url, function(err, response, body) {

      const $ = cheerio.load(body)
      let price = $("span._tA:contains('From')").text().split(" ")[1]
      console.log('Price: ' + price);
    })
  }

  getPrice(car)

  var baseURL = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=' + make1 + '&model=' + make2

  request(baseURL, function(err, res, body) {
    console.log('Error: ' + err);
    var jsonResult = body.slice(2,-2)
    var jsonFinal = JSON.parse(jsonResult)
    console.log('Horsepower: ' + jsonFinal.Trims[0].model_engine_power_ps);
    console.log('Transmission Type: ' + jsonFinal.Trims[0].model_transmission_type);
  })

})
