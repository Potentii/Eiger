


/**
 * Starts the REST service
 * @author Guilherme Reginaldo Ruella
 */
function start(){
   // *Requesting packages:
   const express = require('express');
   const body_parser = require('body-parser');
   const logger = require('./log/logger');
   const app = express();



   // *Enabling json parsing:
   app.use(body_parser.json({limit: '10mb'}));

   // *Enabling response logs inside electron:
   app.use(logger());

   // *Enabling cross domain connections:
   app.use((req, res, next) => {
      // *CORS headers:
      // *Origins allowed:
      res.header('Access-Control-Allow-Origin', '*');
      // *Methods allowed:
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      // *Headers allowed:
      res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Access-Token,Access-Key,Sort-Field,Sort-Type');
      // *Sending to the next middleware:
      next();
   });

   // *Enabling POST requests via Ajax:
   app.options('/*', (req, res, next) => {
      res.status(200).end();
   });



   // *Mapping the REST routes:
   app.use('/', require('./routes/routes').router);

   // *Mapping the media service:
   app.use('/media/', require('./media/media').router);

   // *Sending a 404 response status if the route isn't mapped:
   app.use((req, res, next) => {
      res.status(404)
         .send('Resource not found')
         .end();
   });



   // *Setting up the server port:
   app.set('port', process.env.PORT || 3000);

   // *Starting up the server:
   let server = app.listen(app.get('port'), () => {
      // *Logging the service instance information:
      let address = server.address();
      console.log(` > REST service is running`);
      console.log(`   | Address`);
      console.log(`   | http://${address.address==='::'?'localhost':address.address}:${address.port}/`);
      console.log(`   |`);
      console.log(`   | Media`);
      console.log(`   | ${require('./media/media').media_path}`);
   });
}



/**
 * Builds a promise that starts the REST service:
 * @author Guilherme Reginaldo Ruella
 */
function startServices(){
   // *Returning the promise:
   return new Promise((resolve, reject) => {
      try{
         // *Setup the REST service:
         start();
         // *If everything went well, resolving the promise:
         resolve();
      } catch(err){
         // *If some error occured:
         // *Rejecting the promise:
         reject(err);
      }
   });
}



/**
 * Builds a promise that ends all the services
 * @author Guilherme Reginaldo Ruella
 */
function stopServices(){

   // *Setting up the ending of the database connections:
   let database_stop = new Promise((resolve, reject) => {
      // *Ending the pooler:
      require('./database/pooler').end()
         .then(() => {
            resolve();
         })
         .catch(err => reject(err));
   });


   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Running all the ending promises:
      Promise.all([database_stop])
         .then(() => resolve())
         .catch(err => reject(err));
   }).then(() => {
      console.log(`   |`);
      console.log(`   | REST service finished`);
   });
}



// *Exporting the module:
module.exports = {
   startServices: startServices,
   stopServices: stopServices
};
