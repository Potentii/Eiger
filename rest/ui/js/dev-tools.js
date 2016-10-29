// *When page loads:
$(() => {

   // *Capturing key events:
   document.addEventListener('keydown', (e) => {
      // *Checking if 'F12' is down:
      if(e.which === 123){
         // *If it is:
         // *Toggling the devTools:
         require('electron').remote.getCurrentWindow().toggleDevTools({detach: true});

      // *Checking if 'F5' is down:
      } else if(e.which === 116){
         // *If it is:
         // *Reloading the page:
         //location.reload();
      }
   });

});
