// *Requiring the modules:
const fs = require('fs');
const directory = require('../dir/directory');

// *Defining the settings directory:
const SETTINGS_DIR = '/settings';
// *Defining the files names:
const EMAIL_SETTINGS_FILE = 'email-settings';

// *Creating the settings directory:
directory.create([SETTINGS_DIR]);

// *Defining the app directory path:
let app_path = directory.getAppDirectory() + '/' + directory.APP_NAME;
// *Defining the settings directory path:
let settings_path = app_path + SETTINGS_DIR;



/**
 * Saves a settings file asynchronously
 * @param {string} file_name  The settings' file name
 * @param {string} content    The file's content
 * @return {Promise}          A promise
 * @author Guilherme Reginaldo Ruella
 */
function saveSettings(file_name, content){
   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Saving the file:
      fs.writeFile(settings_path + '/' + file_name + '.json', content, {encoding: 'utf8'}, err => {
         // *Checking if some error occured:
         if(err){
            // *If it did:
            // *Rejecting the promise:
            reject(err);
         } else{
            // *If it didn't:
            // *Resolving the promise:
            resolve();
         }
      });
   });
}



/**
 * Loads a settings file asynchronously
 * @param {string} file_name  The settings' file name
 * @return {Promise}          A promise
 * @author Guilherme Reginaldo Ruella
 */
function loadSettings(file_name){
   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Saving the file:
      fs.readFile(settings_path + '/' + file_name + '.json', {encoding: 'utf8'}, (err, content) => {
         // *Checking if some error occured:
         if(err){
            // *If it did:
            // *Rejecting the promise:
            reject(err);
         } else{
            // *If it didn't:
            // *Resolving the promise:
            resolve(content);
         }
      });
   });
}



// *Exporting this module:
module.exports = {
   saveSettings: saveSettings,
   loadSettings: loadSettings,
   EMAIL_SETTINGS_FILE: EMAIL_SETTINGS_FILE
};
