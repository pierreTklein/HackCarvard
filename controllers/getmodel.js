var express = require('express'),
router = express.Router();
const bodyParser = require('body-parser');

// res = response
router.post('/', function(req, res) {

	var request = require('request');
	var image = req.body.image;

	// post request configuration and api key 
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

	// send post request 
	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	  	var res_json;
	  	// if api returned empty object, return empty, else return vehicle attribute
	  	if ( Object.keys(response.body.objects).length === 0 ) {
	  		res_json = "empty";
	  	} else {
	  		attributes = response.body.objects[0].vehicleAnnotation.attributes;

		  	make = attributes.system.make.name;
		  	model = attributes.system.model.name;
		  	vehicleType = attributes.system.vehicleType;

		  	res_json = '{ "make" : "' + make  + '" , "model" : "' + model + '" ,"vehicleType" : "' + vehicleType + '"  }';
	  	}

	  	res.send(res_json);

	  } else {
	  	res.send('error');
	  }
	});
})

module.exports = router;