


/**
 * Builds a new list row for the log list
 * @param  {object} data The log object
 * @return {jQuery}      The row HTML element
 * @author Guilherme Reginaldo Ruella
 */
function logRowFactory(data){
   // *Building the row element:
   let $row = $('<li>')
      .addClass('row');

   // *Building the status output:
   $('<span>')
      .addClass('status')
      .attr('data-status', Math.floor(data.status/100)*100)
      .text(data.status)
      .appendTo($row);

   // *Building the vertical line:
   $('<div>')
      .addClass('vertical-line')
      .appendTo($row);

   // *Building the method and route container:
   let $method_route = $('<div>')
      .addClass('vertical-layout')
      .appendTo($row);

   // *Building the method output:
   $('<span>')
      .addClass('primary')
      .text(data.method)
      .appendTo($method_route);

   // *Building the route output:
   $('<span>')
      .addClass('secondary')
      .text(data.url)
      .appendTo($method_route);

   // *Returning the row:
   return $row;
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
