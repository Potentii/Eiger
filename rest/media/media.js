// *Defining the media directories:
const MEDIA_DIR = '/media';
const VEHICLE_PHOTOS_DIR = '/v/p';
const USER_PHOTOS_DIR = '/u/p';

// *Defining the allowed mime types for media:
const VEHICLE_PHOTOS_ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
const USER_PHOTOS_ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

// *Requiring express, and its router:
const express = require('express');
const router = express.Router();

// *Requiring the directory module:
const directory = require('../dir/directory');

// *Creating the media directory:
directory.create([MEDIA_DIR, MEDIA_DIR + VEHICLE_PHOTOS_DIR, MEDIA_DIR + USER_PHOTOS_DIR]);

// *Defining the app directory path:
let app_path = directory.getAppDirectory() + '/' + directory.APP_NAME;
// *Defining the media directory path:
let media_path = app_path + MEDIA_DIR + '/';
// *Serving the media service:
router.use('/', express.static(media_path));



function createBase64Media(base64_media, directory, allowed_mime_types){
   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Requiring the modules:
      const fs = require('fs');
      const uuid = require('node-uuid');
      const mime_translation = require('./mime-translation');


      // *Getting the file's mime type:
      let file_mime_type = /^data:(.*?);/i.exec(base64_media)[1];
      // *Getting the file's extension:
      let file_extension = mime_translation.translateMime(file_mime_type);
      // *Getting the file's content:
      let base64_content = /^data:.*?;base64,(.*)/i.exec(base64_media)[1];


      // *Checking if the file data could be set:
      if(!file_mime_type || !file_extension || !base64_content){
         // *If not:
         // *Rejecting the promise:
         reject(new Error('Invalid encoded url'));
         return;
      }


      // *Checking if the file mime type is allowed:
      if(!allowed_mime_types.some(m => m===file_mime_type)){
         // *If it's not:
         // *Rejecting the promise:
         reject(new Error('Invalid mime type'));
         return;
      }


      let file_path = '';
      let file_name = '';
      let tries = 0;
      let file_name_available = false;

      do{
         // *Generating the file name:
         file_name = uuid.v4() + '.' + file_extension;
         // *Building the file path:
         file_path = directory + file_name;
         // *Checking if the name is available:
         file_name_available = !fs.existsSync(file_path);
         // *Increasing the tries counter:
         tries++;

         // *Checking if it's in the fouth try, and the name wasn't available:
         if(tries==4 && !file_name_available){
            console.log(file_path);
            // *Rejecting the promise:
            reject(new Error('Unavailable file name'));
            return;
         }

         // *Running until the file name is available four times at max:
      } while(!file_name_available || tries<4);


      // *Writing the file:
      fs.writeFile(file_path, base64_content, 'base64', (err) => {
         // *Checking if there is some error:
         if(err){
            // *If there's:
            // *Rejecting the promise:
            reject(err);
         } else{
            // *If not:
            // *Resolving it:
            resolve(file_name);
         }
      });
   });
}



/**
 * Saves the media inside the vehicles' photo path
 * @param  {[type]} base64_media [description]
 * @return {[type]}              [description]
 */
function createBase64VehiclePhoto(base64_media){
   // *Redirecting to the following function:
   return createBase64Media(base64_media, app_path + MEDIA_DIR + VEHICLE_PHOTOS_DIR + '/', VEHICLE_PHOTOS_ALLOWED_MIME_TYPES);
}




// *Exporting the module:
module.exports = {
   router: router,
   media_path: media_path,
   createBase64Media: createBase64Media,
   createBase64VehiclePhoto: createBase64VehiclePhoto
};
