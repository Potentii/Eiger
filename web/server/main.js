const path = require('path');
const express = require('express');
const app = express();

// *Serving the static folder files:
app.use('/static', express.static(path.join(__dirname, '../static'), {redirect: true}));

// *Serving the SPA:
app.get(['/', /^\/*?(?!static(?!.))(?!.*\/)/], function(req, res, next) {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// *Setting up the server port:
app.set('port', process.env.PORT || 80);

// *Starting the server:
var server = app.listen(app.get('port'), function(){
   console.log('Server listening on port ' + server.address().port);
});
