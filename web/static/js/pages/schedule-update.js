

// *Browsing the schedule-update page:
spa.onNavigate('schedule-update', (page, params) => {

   // *Playing the inflation animation on the FAB:
   anim.inflate($('#schedule-update-done-fab'));

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the preview schedule info:
         request.getSchedule(id)
            .done((data, textStatus, xhr) => {

               // *Setting the schedule reason:
               $('#schedule-update-reason').val(data.reason);

               // *Setting the schedule start date:
               let start_date = new Date(data.start_date);
               $('#schedule-update-start-date').val(df.asMysqlDate(start_date));

               // *Setting the schedule start time:
               let start_time = new Date(data.start_date);
               $('#schedule-update-start-time').val(df.asShortTime(start_time));

               // *Setting the schedule end time:
               let end_time = new Date(data.end_date);
               $('#schedule-update-end-time').val(df.asShortTime(end_time));

               // *Setting the schedule end date:
               let end_date = new Date(data.end_date);
               $('#schedule-update-end-date').val(df.asMysqlDate(end_date));


               // *Getting all MDL textfields:
               let mdl_textfields = document.querySelectorAll('#schedule-update-section .mdl-js-textfield');
               // *Updating the states of each MDL textfield:
               for(mdl_textfield of mdl_textfields){
                  // *Updating the status:
                  mdl_textfield.MaterialTextfield.updateClasses_();
               }
            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });
            //* Listening for button to send a update to REST:
            $('#schedule-update-form').on('submit', (e) => {
               e.preventDefault();
               // *Open a dialog consent for the user:
               dialogger.open('default-consent', {title: 'schedule-update-dialog-consent-title', message: 'schedule-update-dialog-consent-message'}, (dialog, status, params) => {
                  // *Switch to verify a status of dialog:
                  switch(status){
                  // *When the status is positive:
                  case dialogger.DIALOG_STATUS_POSITIVE:
                  // *Call the function to update a vehicle data:
                     updateSchedule(id);
                     break;
                  }
               });
            });
      }
   }else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});


// *Cleaning listernes from this page:
spa.onUnload('schedule-update', (page) => {
  // *Cleaning the event submit:
  $('#schedule-update-form').off('submit');
  // *Cleaning inputs when the page is left:
  $('#schedule-update-reason').val('');
  $('#schedule-update-start-date').val('');
  $('#schedule-update-start-time').val('');
  $('#schedule-update-end-time').val('');
  $('#schedule-update-end-date').val('');
});

/**
* Sends the schedule update request to REST
* @param  {number} id   Id of schedule
* @author Willian Conti Rezende
*/
function updateSchedule(id){

  // *Getting data of inputs:
  let schedule_reason = $('#schedule-update-reason').val();
  let schedule_start_date = $('#schedule-update-start-date').val();
  let schedule_start_time = $('#schedule-update-start-time').val();
  let schedule_end_time = $('#schedule-update-end-time').val();
  let schedule_end_date = $('#schedule-update-end-date').val();

  // *Joining date and time:
  let start_date_schedule = schedule_start_date + ' ' + schedule_start_time;
  let end_date_schedule = schedule_end_date + ' ' + schedule_end_time;

  // *Create a objetct to receiva values to update a schedule:
  // *TODO Add the vehicle and user's id:
  let data_update_schedule = {
     reason: schedule_reason?schedule_reason:undefined,
     start_date: start_date_schedule,
     end_date: end_date_schedule

  }



  // *Sending a Update Vehicle to the table vehicle on database:
  request.putSchedule(id, data_update_schedule)
     .done((data, textStatus, xhr) => {
        // *Showing the snack with the message:
        snack.open('Schedule updated', snack.TIME_SHORT);
        // *Going to index page:
        spa.navigateTo('');
     })
     .fail((xhr, textStatus, err) => {
      let text = {title: '', message: ''};

      // *Switch to receive error code
      switch(xhr.responseJSON.err_code){

      // *Case when the user or the vehicle referenced doesn't exist
      case 'ERR_REF_NOT_FOUND':
         text.title = srm.get('schedule-update-dialog-error-ref-title');
         text.message = srm.get('schedule-update-dialog-error-ref-message');
         break;

      // *Case when the vehicle selected is not active:
      case 'ERR_VEHICLE_NOT_ACTIVE':
         text.title = srm.get('schedule-update-dialog-error-vehicle-not-active-title');
         text.message = srm.get('schedule-update-dialog-error-vehicle-not-active-message');
         break;

      // *Case when the user is not active:
      case 'ERR_USER_NOT_ACTIVE':
         text.title = srm.get('schedule-update-dialog-error-user-not-active-title');
         text.message = srm.get('schedule-update-dialog-error-user-not-active-message');
         break;

      // *Case when the user not authorized:
      case 'ERR_NOT_AUTHORIZED':
         text.title = srm.get('schedule-update-dialog-error-not-authorized-title');
         text.message = srm.get('schedule-update-dialog-error-not-authorized-message');
         break;

      // *Case when the vehicle selected is not availabe:
      case 'ERR_RES_UNAVAILABLE':
         text.title = srm.get('schedule-update-dialog-error-unavailable-title');
         text.message = srm.get('schedule-update-dialog-error-unavailable-message');
         break;


      // *Case when the period is invalid:
      case 'ERR_INVALID_TIMESPAN':
         text.title = srm.get('schedule-update-dialog-error-timespan-title');
         text.message = srm.get('schedule-update-dialog-error-timespan-message');
         break;

      // *Case when schedule not found:
      case 'ERR_NOT_FOUND':
         text.title = srm.get('schedule-update-dialog-error-notfound-schedule-title');
         text.message = srm.get('schedule-update-dialog-error-notfound-schedule-message');
         break;


      // *Action default of switch:
      default:
         text.title = srm.get('schedule-update-dialog-error-default-title');
         text.message = srm.get('schedule-update-dialog-error-default-message');
         break;
      }
    });
}
