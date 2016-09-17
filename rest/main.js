// *Requesting packages:
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const body_parser = require('body-parser');
const app = express();



// *Enabling json parsing:
app.use(body_parser.json());

// *Enabling request logs:
app.use(morgan('dev'));

// *Enabling cross domain connections:
app.use((req, res, next) => {
   // *CORS headers:
   // *Origins allowed:
   res.header('Access-Control-Allow-Origin', '*');
   // *Methods allowed:
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   // *Headers allowed:
   res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Access-Token,Access-Key');

   // *Sending to next handler:
   next();
});

// *Enabling POST requests via Ajax:
app.options('/*', (req, res, next) => {
   res.status(200).end();
});



// *Applying authentication on '/api/v1' rout:
app.all('/api/v1/*', require('./middlewares/authentication'));

// *Applying authorization on '/api/v1/admin' rout:
//app.all('/api/v1/admin/*', require('./middlewares/authorization'));

// *Mapping the routes:
app.use('/', require('./routes/routes'));

// *Sending a 404 response status if the route isn't mapped:
app.use((req, res, next) => {
   var err = new Error('Resource not Found');
   err.status = 404;
   next(err);
});



// TODO end pooler when finish the service



// *Setting up the server port:
app.set('port', process.env.PORT || 3000);

// *Starting up the server:
var server = app.listen(app.get('port'), () => {
   console.log(server.address());
   console.log('REST service is running on port ' + server.address().port);
});
