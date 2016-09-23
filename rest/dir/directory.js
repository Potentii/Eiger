const APP_NAME = 'eiger';



/**
 * Retrieves the current system app directory
 * @return {string}  The path of app directory
 * @author Guilherme Reginaldo Ruella
 */
function getAppDirectory(){
   // *Getting the system's appdata/home directory:
   let app = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
   // *Changing the backward slashes with forward slashes, and returning it:
   return app.replace(/\\/g, '/');
}



/**
 * Creates multiple directories inside the application folder
 * @param  {(string|string[])} directories An array of relative directories path
 * @author Guilherme Reginaldo Ruella
 */
function create(directories){
   // *Requiring the directory creation module:
   const mkdirp = require('mkdirp');

   // *Retrieving the system's app directory:
   let app = getAppDirectory();

   // *Checking if 'directories' is an array:
   if(Array.isArray(directories)){
      // *If it is:
      // *Creating all directories:
      for(directory of directories){
         mkdirp.sync(app + '/' + APP_NAME + directory);
      }
   } else{
      // *If it isn't:
      // *Creating the directory:
      mkdirp.sync(app + '/' + APP_NAME + directories);
   }
}



// *Exporting the module:
module.exports = {
   create: create,
   getAppDirectory: getAppDirectory,
   APP_NAME: APP_NAME
};
