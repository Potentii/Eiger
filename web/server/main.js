const path = require('path');
const express = require('express');
const app = express();

// *Serving the static folder files:
app.use('/static', express.static(path.join(__dirname, '../static'), {redirect: true}));

// *Serving the SPA:
app.get(['/', /^\/*?(?!static(?!.))(?!.*\/)/], (req, res, next) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// *Setting up the server port:
app.set('port', process.env.PORT || 80);

// *Starting up the server:
let server = app.listen(app.get('port'), () => {
   // *Logging the service instance information:
   let address = server.address();
   console.log(` > Webserver is running`);
   console.log(`   | Address`);
   console.log(`   | http://${address.address==='::'?'localhost':address.address}${address.port==80?'':':' + address.port}/`);
});
