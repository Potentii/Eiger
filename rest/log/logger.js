/**
 * Represents a stream to log messages inside the electron application
 * @author Guilherme Reginaldo Ruella
 */
class ElectronLogStream extends require('stream').Writable {
   _write(chunk, enc, next){

      // *Getting the window frame:
      let win = require('../main').getWindow();

      // *Checking is the window frame is set:
      if(win){
         // *If it is:
         // *Sending the log to renderer's 'log' channel:
         try{
            win.webContents.send('log', JSON.parse(chunk.toString()));
         } catch(err){
            console.log('LOG STREAM ERROR');
            console.log(err);
         }
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
   morgan.format('electron-logger', '{\"method\":\":method\", \"url\":\":url\", \"status\":\":status\", \"response_time\":\":response-time\"}');

   // *Returning the logger, with a custom stream:
   return morgan('electron-logger', {stream: new ElectronLogStream()});
};
