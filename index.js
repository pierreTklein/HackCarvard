const express = require('express')
const bodyParser = require('body-parser');
const cheerio = require('cheerio')
const request = require('request');

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
// app.post('/api/reviews', function(req, res) {
//     var make = req.body.make;
//     var model = req.body.model;
// });

function getPrice(url){
  request(url, function(err, response, body){

    const $ = cheerio.load(body)
    let price = $("span._tA:contains('From')").text();
    return price;
  })
}

function getRating(url, response){
  request(url, function(err, res, body){
    const $ = cheerio.load(body);
    let ratingTextOutOf5 = $("div._Fng:contains('/5')").text();
    let ratingTextOutOf10 = $("div._Fng:contains('/10')").text();
    var ratingText = ratingTextOutOf5+ratingTextOutOf10;
    //SUPER JANK, I KNOW... That's the unicode value of the element that splits the rating from the source.
    //This gives: [4.5/5,'edmunds3/5','car source']
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


app.post('/api/getPrice', function(req,res){
  var make = req.body.make;
  var model = req.body.model;
  try{
    getPrice(generateGoogleQuery(make, model), res);  
  }
  catch(err)
  {
    response.send("Error while trying to get the price");
  }
})

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
