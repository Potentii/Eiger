// *Requiring the modules:
const directory = require('../dir/directory');

// *Defining the settings directory:
const SETTINGS_DIR = '/settings';
// *Defining the files names:
const EMAIL_SETTINGS_FILE = 'email-settings';

// *Defining the app directory path:
const APP_PATH = directory.getAppDirectory() + '/' + directory.APP_NAME;
// *Defining the settings directory path:
const SETTINGS_PATH = APP_PATH + SETTINGS_DIR;

// *Initializing the setting change event list:
let SETTINGS_CHANGE_EVENTS = new Map();



/**
 * Sets up the settings service
 * @return {Promise}  The setup promise
 * @author Guilherme Reginaldo Ruella
 */
function setupService(){
   // *Returning a promise:
   return new Promise((resolve, reject) => {
      try{
         // *Creating the settings directory:
         directory.create([SETTINGS_DIR]);

         // *Resolving the promise:
         resolve();
      } catch(err){
         // *If something went wrong:
         // *Rejecting the promise:
         reject();
      }
   });
}



/**
 * Saves a settings file asynchronously
 * @param {string} file_name  The settings' file name
 * @param {string} content    The file's content
 * @return {Promise}          A promise
 * @author Guilherme Reginaldo Ruella
 */
function saveSettings(file_name, content){
   const fs = require('fs');

   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Saving the file:
      fs.writeFile(SETTINGS_PATH + '/' + file_name + '.json', content, {encoding: 'utf8'}, err => {
         // *Checking if some error occured:
         if(err){
            // *If it did:
            // *Rejecting the promise:
            reject(err);
         } else{
            // *If it didn't:
            settingsChanged(file_name, content);
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
   const fs = require('fs');

   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Saving the file:
      fs.readFile(SETTINGS_PATH + '/' + file_name + '.json', {encoding: 'utf8'}, (err, content) => {
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



/**
 * Triggers all the action assigned to this event
 * @param {string} file_name The settings' file name
 * @param {string} new_content The file's new content
 * @author Guilherme Reginaldo Ruella
 */
function settingsChanged(file_name, new_content){
   // *Getting the event handler associated with the given file:
   let event_handler = SETTINGS_CHANGE_EVENTS.get(file_name);

   // *Checking if the event handler was set:
   if(event_handler){
      // *If it was:
      // *Calling all listeners:
      event_handler.resolveAll(f => f(new_content));
   }
}



/**
 * Adds a new listener on 'settings changed' event for a given setting file
 * @param {string} file_name           The setting file
 * @param {function|function[]} action The listener
 * @author Guilherme Reginaldo Ruella
 *
 */
function onSettingsChanged(file_name, action){
   const HandledEvent = require('../util/HandledEvent');

   // *Checking if action is a function, returning if it's not:
   if(typeof(action) !== 'function') return;

   // *Getting the event handler associated with the given file:
   let event_handler = SETTINGS_CHANGE_EVENTS.get(file_name);

   // *Checking if the event handler was set:
   if(!event_handler){
      // *If it wasn't:
      // *Assign a new one to it:
      event_handler = new HandledEvent();
      // *Adding it to the events list:
      SETTINGS_CHANGE_EVENTS.set(file_name, event_handler);
   }

   // *Adding the listener:
   event_handler.addListener(action)
}



// *Exporting this module:
module.exports = {
   saveSettings: saveSettings,
   loadSettings: loadSettings,
   setupService: setupService,
   onSettingsChanged: onSettingsChanged,
   EMAIL_SETTINGS_FILE: EMAIL_SETTINGS_FILE,
   SETTINGS_PATH: SETTINGS_PATH
};
