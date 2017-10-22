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

app.post('/api/getStats', function(req, res) {

  var make = req.body.make
  var model = req.body.model


  Promise.all([
   api.getPrice(make, model),
   api.getStats(make, model)
 ])
 .then(result => {
   const data = {
     price: result[0].price,
     horsepower: result[1].horsepower,
     transmision: result[1].transmision
   }
   res.send(data)
  // console.log(result)
 })
        // res.send()


})

const api = {
  getPrice: (make, model) => {
    return new Promise((resolve, reject) => {
      var car = 'https://www.google.com/search?q=' + make + '+' + model + '+' + 'price'
      request(car, function(err, response, body) {
        if (err) reject(err)
        const $ = cheerio.load(body)
        let price = $("span._tA:contains('From')").text().split(" ")[1]
        resolve({price: price})
      })
    })
  },
  getStats: (make, model) => {
    return new Promise((resolve, reject) => {
      var baseURL = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=' + make + '&model=' + model

      request(baseURL, function(err, response, body) {
        if(err) reject(err)
        var jsonResult = body.slice(2, -2)
        var jsonFinal = JSON.parse(jsonResult)
        horsepower = jsonFinal.Trims[0].model_engine_power_ps
        transmision = jsonFinal.Trims[0].model_transmission_type
        resolve({horsepower: horsepower, transmision: transmision})
      })
    })
  }
}
