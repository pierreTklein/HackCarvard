const express = require('express')
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

//make sure that api endpoint addresses start with /api/...
app.post('/api/reviews', function(req, res) {
    var make = req.body.make;
    var model = req.body.model;
});

// res = response
app.post('/api/getmodel/', function(req, res) {

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
