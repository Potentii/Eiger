

// *When the user navigates to this page:
spa.onNavigate('log', (page, params) => {
   // *Calling the 'on log changed' handler:
   onLogsChanged();

   // *When the user clicks on the clear FAB:
   $('#log-clear-fab').on('click', e => {
      // *Removing all the log entries:
      $('#log-list > li').remove();
      // *Calling the 'on log changed' handler:
      onLogsChanged();
   });
});



// *When the user left this page:
spa.onLeft('log', (page) => {
   // *Removing the buttons listeners:
   $('#log-clear-fab').off('click');
});



// *When the SPA system gets loaded:
spa.onReady(() => {
   // *Requiring the ipc module:
   const {ipcRenderer} = require('electron');

   // *Setting up the 'log' channel:
   ipcRenderer.on('log', (e, data) => {
      // *Adding a new log row in the list:
      $('#log-list').prepend(logRowFactory(data));
      // *Calling the 'on log changed' handler:
      onLogsChanged();
   });

   // *Loading the log page:
   spa.navigateTo('log');
});



/**
 * Handles the size changing of log entries list
 * @author Guilherme Reginaldo Ruella
 */
function onLogsChanged(){
   let entries = $('#log-list > li').length;

   // *Checking if there is more than 50 log entries:
   if(entries > 50){
      // *If there is:
      // *Removing them:
      $('#log-list > li:nth-of-type(51)').remove();
   } else if(!entries){
      // *If the list is empty:
      // *Adding the empty class:
      $('#log-list').addClass('empty');
   } else{
      // *If the list is not empty:
      // *Adding the empty class:
      $('#log-list').removeClass('empty');
   }
}



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
      .addClass('flex-vertical-layout')
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
