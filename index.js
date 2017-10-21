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

var make1 = 'subaru'
var make2 = 'forester'

var car = 'https://www.google.com/search?q=' + make1 + '+' + make2 + '+' + 'price'

function getPrice(url){
  request(url, function(err, response, body){

    const $ = cheerio.load(body)
    // console.log('scraping ' + url)
    console.log($.html())
    price = $
  })
}

getPrice(car)

// app.get('/api/getstats', function(req, res){
//   getPrice()
//
// })
