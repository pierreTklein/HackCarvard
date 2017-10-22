const express = require('express')
const bodyParser = require('body-parser');
const cheerio = require('cheerio')
const request = require('request');

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


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

        horsepower = (jsonFinal.Trims[0]) ? jsonFinal.Trims[0].model_engine_power_ps : 'unknown'
        transmision = (jsonFinal.Trims[0]) ? jsonFinal.Trims[0].model_transmission_type : 'unknown'

        resolve({horsepower: horsepower, transmision: transmision})
      })
    })
  }
}

app.get('/', function (req, res) {
  res.send('Please check out Hack Harvard')
})

function getRating(url, response){
  request(url, function(err, res, body){
    const $ = cheerio.load(body);
    let ratingTextOutOf5 = $("div._Fng:contains('/5')").text();
    let ratingTextOutOf10 = $("div._Fng:contains('/10')").text();
    var ratingText = ratingTextOutOf5+ratingTextOutOf10;
    //SUPER JANK, I KNOW... That's the unicode value of the element that splits the rating from the source.
    //This gives: ['4.5/5','edmunds3/5','car source']
    var partialResult = ratingText.split(String.fromCharCode(65533));
    function RatingObj(){
      return {'rating':'n/a','source':'unknown'};
    }
    var actualRatingsAndSources = [];
    //Go through all the ratings and add them to the array
    for(var i = 0; i < partialResult.length; i++)
    {
      //Regexp that returns whether or not a given string contains some digit over 5, or some digit over 10.
      var ratingRegexp = new RegExp(/(\d(.\d)?\/(5|10))/);
      var sanitizedRatings = ratingRegexp.exec(partialResult[i]);
      if(sanitizedRatings != null)
      {
        var nextRatingObj = new RatingObj();
        nextRatingObj.rating = sanitizedRatings[0];
        //this means that it's a combination of a source and a rating, e.g.: Edmunds3/5
        if(sanitizedRatings[0] != partialResult[i])
        {
          //The result minus the rating is the previous rating's source.
          actualRatingsAndSources[actualRatingsAndSources.length-1].source = partialResult[i].replace(ratingRegexp,'');
        }
        actualRatingsAndSources.push(nextRatingObj);
      }
      else if(actualRatingsAndSources.length > 0)
      {
        actualRatingsAndSources[actualRatingsAndSources.length-1].source = partialResult[i];
      }
    }
    response.send(actualRatingsAndSources);
  });
}
function generateGoogleQuery(make, model){
  return 'https://www.google.com/search?q=' + make + '+' + model + '+' + 'price'
}

app.post('/api/getRating', function(req, res){
  var make = req.body.make;
  var model = req.body.model;
  try{
    getRating(generateGoogleQuery(make, model), res);
  }
  catch(err)
  {
    response.send("Error while trying to get the rating");
  }
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

app.post('/api/edmundsLink', function(req, res){
  res.send('https://www.edmunds.com/'+req.body.make +'/' + req.body.model);
})
