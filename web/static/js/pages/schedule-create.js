


// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {

   // *When the user submit the form:
   $('#schedule-create-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      // *Retrieving the values of the all fields:
      let text_reason = $('#schedule-create-reason').val();
      let date_startdate = $('#schedule-create-start-date').val();
      let time_starttime = $('#schedule-create-start-time').val();
      let date_enddate = $('#schedule-create-end-date').val();
      let time_endtime = $('#schedule-create-end-time').val();

      // *Joining date and time:
      let start_date_time = date_startdate + ' ' + time_starttime;
      let end_date_time = date_enddate + ' ' + time_endtime;

      // TODO Replace the ids with the actual value:
      let user_id = 1;
      let vehicle_id = 1;

      // *Saving all values in a object_data:
      let object_data = {
         id_vehicle_fk: vehicle_id,
         id_user_fk: user_id,
         reason: text_reason,
         start_date: start_date_time,
         end_date: end_date_time
      };

      request.postSchedule(object_data)
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
