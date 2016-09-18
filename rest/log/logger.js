/**
 * Represents a stream to log messages inside the electron application
 * @author Guilherme Reginaldo Ruella
 */
class ElectronStream extends require('stream').Writable {
   _write(chunk, enc, next){

      // *Getting the window frame:
      let win = require('../main').getWindow();

      // *Checking is the window frame is set:
      if(win){
         // *If it is:
         // *Send the log to renderer's 'log' channel:
         win.webContents.send('log', chunk.toString());
      }

      // *Going to next chunk:
      next();
   }
}



// *Exporting the logger:
module.exports = () => {
   // *Requiring the log module:
   let morgan = require('morgan');

   // *Setting up the log format:
   morgan.format('electron-logger', ':method :url :status - :response-time ms');

   // *Returning the logger, with a custom stream:
   return morgan('electron-logger', {stream: new ElectronStream()});
};
