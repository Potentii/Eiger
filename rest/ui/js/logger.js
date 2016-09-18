


/**
 * Builds a new list row for the log list
 * @param  {string} data The log text
 * @return {jQuery}      The row HTML element
 * @author Guilherme Reginaldo Ruella
 */
function logRowFactory(data){
   // *Processing the log, giving it some highlighting:
   data = data.replace(/(\/.*\s)(\d)(\d)(\d)/i, '<span class="bold">$1</span><span data-status="$200">$2$3$4</span>');
   // *Building the row element:
   let row = $('<li>').addClass('row');
   // *Building the row's content element:
   $('<span>').addClass('primary').appendTo(row).append(data);
   // *Returning the row:
   return row;
}



// *When page loads:
$(() => {
   // *Requiring the ipc module:
   const {ipcRenderer} = require('electron');

   // *Setting up the 'log' channel:
   ipcRenderer.on('log', (e, data) => {
      // *Adding a new log row in the list:
      $('#log-list').prepend(logRowFactory(data));
   })
});
