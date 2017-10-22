const express = require('express')
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

app.use('/', require('./controllers/homepage'))
app.use('/api/getmodel', require('./controllers/getmodel'))
app.use('/api/getStats', require('./controllers/getstats'))
app.use('/api/getrating', require('./controllers/getratings'))
app.use('/api/edmundsLink', require('./controllers/edmundslink'))

