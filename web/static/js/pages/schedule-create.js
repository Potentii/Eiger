


// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {
   
   // *When the user submit the form:
   $('#schedule-create-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      request.postSchedule()
         .done((data, textStatus, xhr) => {
            // *Sending user to index page:
            spa.navigateTo('');
         })
         .fail((xhr, textStatus, err) => {
            console.log(textStatus);
         });
   });
});



// *When the user left the page:
spa.onUnload('schedule-create', (page)=> {
   // *Removing the submit listeners from the form:
   $('#schedule-create-form').off('submit');
});
