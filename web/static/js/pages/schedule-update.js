

// *Browsing the schedule-update page:
spa.onNavigate('schedule-update', (page, params) => {

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *Checking if the params is diferent undefined ou null:
      if(params && (params.id !== null && params.id !== undefined)){

         let schedule_id = params.id;
         let selected_vehicle;
         let selected_user;

         // *Removing the invalid state on the fields:
         mdl_util.clearTextFieldsValidity('#schedule-update-section');

         // *Listing the preview schedule info:
         request.getSchedule(schedule_id)
            .done(data => {
               // *Setting the vehicle id and user id:
               selected_vehicle = data.id_vehicle_fk;
               selected_user = data.id_user_fk;

               // *Passing the variables by reference:
               setup(schedule_id, selected_vehicle, selected_user);

               // *Setting the schedule reason:
               $('#schedule-update-reason').val(data.reason);

               // *Setting the schedule status:
               $('input:radio[name="schedule-update-confirmed"][value="planned"]').prop('checked', !data.confirmed);
               $('input:radio[name="schedule-update-confirmed"][value="confirmed"]').prop('checked', data.confirmed);

               // *Setting the schedule start date:
               let start_date = new Date(data.start_date);
               $('#schedule-update-start-date').val(df.asMysqlDate(start_date));

               // *Setting the schedule start time:
               let start_time = new Date(data.start_date);
               $('#schedule-update-start-time').val(df.asShorterTime(start_time));

               // *Setting the schedule end time:
               let end_time = new Date(data.end_date);
               $('#schedule-update-end-time').val(df.asShorterTime(end_time));

               // *Setting the schedule end date:
               let end_date = new Date(data.end_date);
               $('#schedule-update-end-date').val(df.asMysqlDate(end_date));

               // *Updating MDL Textfields:
               mdl_util.updateTextFields('#schedule-update-section');

               // *Updating MDL Radios:
               mdl_util.updateRadios('#schedule-update-section');
            })
            .fail(xhr => {
               // *Checking if the request's status is 401, sending the user to the login page if it is:
               if(xhr.status === 401){
                  spa.navigateTo('login');
                  return;
               }
               console.log(xhr.responseJSON);
            });
      } else{
         // *Is not diferent of null ou undefined:
         // *Redirecting the user to index page:
         spa.navigateTo('');
      }
   }



   function setup(schedule_id, selected_vehicle, selected_user){

      // *Showing the vehicle in app bar:
      scheduleUpdateUtil().updateVehicleInfo(selected_vehicle);
      // *Showing the user in app bar:
      scheduleUpdateUtil().updateUserInfo(selected_user);



      // *Clicking on a vehicle header:
      $('#schedule-update-vehicle-app-bar').on('click' , e => {

         // *Opening the vehicle-picker page:
         dialogger.open('vehicle-picker', {previous_selected_vehicle: selected_vehicle}, (dialog, status, params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Setting the id the vehicle selected by parameter:
               selected_vehicle = params.id;
               // *Updating the vehicle info selected:
               scheduleUpdateUtil().updateVehicleInfo(selected_vehicle);
               break;
            }
         });
      });


      // *Getting the user permission:
      let permission = request.retrieveUserPermissions();

      // *Checking the permission to the manage schedule:
      if(!permission.permissions.manage_schedules){
         // *If not permission:
         // *Disabling click the selected user:
         $('#schedule-update-user-app-bar').addClass('inactive').off('click');
      } else{
         // *Enabling click the selected user:
         $('#schedule-update-user-app-bar').on('click', e => {

            // *Opening the user-picker page:
            dialogger.open('user-picker', {previous_selected_user: selected_user}, (dialog, status, params) => {

               // *Checking if the case was positive:
               switch(status){
               case dialogger.DIALOG_STATUS_POSITIVE:
                  // *Setting the id the user selected by parameter:
                  selected_user = params.id;
                  // *Updating the user info selected:
                  scheduleUpdateUtil().updateUserInfo(selected_user);
                  break;
               }
            });
         });
      }



      //* Listening for button to send a update to REST:
      $('#schedule-update-form').submit((e) => {
         e.preventDefault();
         // *Opening a dialog consent for the user:
         dialogger.open('default-consent', {
            title: srm.get('schedule-update-dialog-consent-submit-title'),
            message: srm.get('schedule-update-dialog-consent-submit-message')
         },
         (dialog, status, params) => {
            // *Checking a status of dialog:
            switch(status){
            // *When the status is positive:
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Calling the function to update a vehicle data:
               scheduleUpdateUtil().updateSchedule(schedule_id, selected_vehicle, selected_user);
               break;
            }
         });
      });
   }
});


// *Cleaning listernes from this page:
spa.onLeft('schedule-update', (page) => {
   // *Cleaning the event submit:
   $('#schedule-update-form').off('submit');

   // *Cleaning inputs when the page is left:
   $('#schedule-update-reason').val('');
   $('input:radio[name="schedule-update-confirmed"][value="planned"]').prop('checked', true);
   $('#schedule-update-start-date').val('');
   $('#schedule-update-start-time').val('');
   $('#schedule-update-end-time').val('');
   $('#schedule-update-end-date').val('');

   // *Removing the event onClick:
   $('#schedule-update-vehicle-app-bar').off('click');
   $('#schedule-update-user-app-bar').removeClass('inactive').off('click');

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#schedule-update-section');

   // *Updating MDL Radios:
   mdl_util.updateRadios('#schedule-update-section');
});



/**
 * Module that updates vehicle-info, user-info and all schedule
 * @author Ralf Pablo Braga Soares
 */
function scheduleUpdateUtil(){



   /**
   * Sends the schedule update request to REST
   * @param  {number} schedule_id         Id of schedule
   * @param  {number} selected_vehicle    Id of vehicle
   * @param  {number} selected_user       Id of user
   * @author Willian Conti Rezende
   */
   function updateSchedule(schedule_id, selected_vehicle, selected_user){

      // *Getting data of inputs:
      let schedule_reason = $('#schedule-update-reason').val();
      let confirmed = $("input:radio[name='schedule-update-confirmed']:checked").val() === 'confirmed'?true:false;
      let schedule_start_date = $('#schedule-update-start-date').val();
      let schedule_start_time = $('#schedule-update-start-time').val();
      let schedule_end_time = $('#schedule-update-end-time').val();
      let schedule_end_date = $('#schedule-update-end-date').val();

      // *Joining date and time:
      let start_date_schedule = schedule_start_date + ' ' + schedule_start_time;
      let end_date_schedule = schedule_end_date + ' ' + schedule_end_time;

      // *Create a object to receive values to update a schedule:
      let data_update_schedule = {
         reason: schedule_reason,
         confirmed: confirmed,
         start_date: start_date_schedule,
         end_date: end_date_schedule,
         id_vehicle_fk: selected_vehicle,
         id_user_fk: selected_user
      }



      // *Sending a Update Vehicle to the table vehicle on database:
      request.putSchedule(schedule_id, data_update_schedule)
         .done(data => {
            // *Showing the snack with the message:
            snack.open(srm.get('schedule-update-successful-snack'), snack.TIME_SHORT);
            // *Going back to schedule-info:
            spa.goBack();
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            let text = {title: '', message: ''};

            // *Checking the error code:
            switch(xhr.responseJSON.err_code){

            // *When the user or the vehicle referenced doesn't exist:
            case 'ERR_REF_NOT_FOUND':
               text.title = srm.get('schedule-update-dialog-error-ref-title');
               text.message = srm.get('schedule-update-dialog-error-ref-message');
               break;

            // *When the vehicle selected is not active:
            case 'ERR_VEHICLE_NOT_ACTIVE':
               text.title = srm.get('schedule-update-dialog-error-vehicle-not-active-title');
               text.message = srm.get('schedule-update-dialog-error-vehicle-not-active-message');
               break;

            // *When the user is not active:
            case 'ERR_USER_NOT_ACTIVE':
               text.title = srm.get('schedule-update-dialog-error-user-not-active-title');
               text.message = srm.get('schedule-update-dialog-error-user-not-active-message');
               break;

            // *When the user not authorized:
            case 'ERR_NOT_AUTHORIZED':
               text.title = srm.get('schedule-update-dialog-error-not-authorized-title');
               text.message = srm.get('schedule-update-dialog-error-not-authorized-message');
               break;

            // *When the vehicle selected is not availabe:
            case 'ERR_RES_UNAVAILABLE':
               text.title = srm.get('schedule-update-dialog-error-unavailable-title');
               text.message = srm.get('schedule-update-dialog-error-unavailable-message');
               break;


            // *When the period is invalid:
            case 'ERR_INVALID_TIMESPAN':
               text.title = srm.get('schedule-update-dialog-error-timespan-title');
               text.message = srm.get('schedule-update-dialog-error-timespan-message');
               break;

            // *When schedule not found:
            case 'ERR_NOT_FOUND':
               text.title = srm.get('schedule-update-dialog-error-notfound-schedule-title');
               text.message = srm.get('schedule-update-dialog-error-notfound-schedule-message');
               break;

            default:
               text.title = srm.get('schedule-update-dialog-error-default-title');
               text.message = srm.get('schedule-update-dialog-error-default-message');
               break;
            }

            // *Opening a dialog notice for the user:
            dialogger.open('default-notice', text);
         });
   }



   /**
    * Update the vehicle info
    * @param  {number} selected_vehicle id the vehicle
    * @author Ralf Pablo Braga Soares
    */
   function updateVehicleInfo(selected_vehicle){

      // *Replacing the vehicle in app bar:
      request.getVehicle(selected_vehicle)
         .done(data => {

            // *Setting the vehicle's photo:
            $('#schedule-update-vehicle-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/' + data.photo + ')':'');

            // *Setting the vehicle's title and plate:
            $('#schedule-update-vehicle-title').text(data.title + " - " + data.plate);

            // *Setting the vehicle's year and manufacturer:
            $('#schedule-update-vehicle-description').text(data.year + " - " + data.manufacturer);
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            console.log(xhr.responseJSON);
         });
   }



   /**
    * Update the user info
    * @param  {number} selected_user id the user
    * @author Ralf Pablo Braga Soares
    */
   function updateUserInfo(selected_user){

      // *Replacing the user in app bar:
      request.getUser(selected_user)
         .done(data => {

            // *Setting the user's photo:
            $('#schedule-update-user-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');

            // *Setting the User name:
            $('#schedule-update-user-name').text(data.name);

            // *Setting the user's login:
            $('#schedule-update-user-login').text(data.login);
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            console.log(xhr.responseJSON);
         });
   }

   // *Exporting this module:
   return {
      updateSchedule: updateSchedule,
      updateVehicleInfo: updateVehicleInfo,
      updateUserInfo: updateUserInfo
   };
}
