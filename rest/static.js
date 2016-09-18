var photosDir = '/content/photos';



/**
 * Starts the static files service
 * @author Guilherme Reginaldo Ruella
 */
function start(){
   // *Requiring the express:
   const express = require('express');
   const app = express();

   // *Requiring the directory module:
   const directory = require('./dir/directory');

   // *Creates the photos' directory:
   directory.create([photosDir]);

   // *Serving the photos directory:
   app.use(photosDir + '/', express.static(directory.getAppDirectory() + photosDir + '/'));
}



// *Exporting the module:
module.exports = {
   start: start
};
