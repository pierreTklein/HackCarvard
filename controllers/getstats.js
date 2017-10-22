var express = require('express'),
router = express.Router();
const cheerio = require('cheerio')
const request = require('request');
const bodyParser = require('body-parser');


// GET CAR PRICES
router.post('/', function(req, res) {

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
	})
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

        horsepower = (jsonFinal.Trims[0]) ? jsonFinal.Trims[0].model_engine_power_ps : 'unknown'
        transmision = (jsonFinal.Trims[0]) ? jsonFinal.Trims[0].model_transmission_type : 'unknown'

        resolve({horsepower: horsepower, transmision: transmision})
      })
    })
  }
}

module.exports = router;