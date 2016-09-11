const path = require('path');
const express = require('express');
const app = express();


app.use('/static', express.static(path.join(__dirname, '../static'), {redirect: true}));
app.get(['/', '/*'], function(req, res, next) {
  res.sendFile(path.join(__dirname, '../index.html'));
});


// *Setting up the server port:
app.set('port', process.env.PORT || 3000);


// *Starting the server:
var server = app.listen(app.get('port'), function(){
   console.log('Server listening on port ' + server.address().port);
});
