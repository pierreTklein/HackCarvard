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

// res = response
app.post('/api/getmodel/', function(req, res) {

	var request = require('request');
	var image = req.body.image;

	var options = {
	  uri: 'https://dev.sighthoundapi.com/v1/recognition?objectType=vehicle,licenseplate',
	  method: 'POST',
	  headers: {
	  	'Content-type': 'application/json',
	  	'X-Access-Token': 'B1scq2lizVyZZV1gkBcu3pGvfu3JSAm4HjKS'
	  },
	  json: {
	    "image": image
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	json = JSON.parse(response.body);
		// res.send('API for model of car ' + JSON.stringify(json["objects"]));
	    res.send('API for model of car ' + JSON.stringify(response.body));
	  } else {
	  	res.send('There was an error processing the API call');
	  }
	});

})
