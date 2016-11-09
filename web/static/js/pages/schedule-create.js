

// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {
   // *Getting the user permission:
   let permission = request.retrieveUserPermissions();

   let selected_user;
   let selected_vehicle;

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      // *Removing the invalid state on the fields:
      mdl_util.clearTextFieldsValidity('#schedule-create-section');

      // *Checking if the previous selected vehicle was set:
      if(params && (params.id !== null && params.id !== undefined)){
         // *If it was:
         // *Setting up the page :
         setup(params.id);
      } else{
         // *If it wasn't
         // *Requesting the vehicles:
         request.getVehicles()
            .done(data => {
               // *Checking if there is any vehicle registered:
               if(data.length){
                  // *If exists:
                  // *Setting up the page with first vehicle found:
                  setup(data[0].id);
               } else{
                  // *If not exists:
                  // *Showing a dialog-notice if not exists vehicle:
                  dialogger.open('default-notice', {
                     title: srm.get('schedule-create-dialog-no-vehicles-title'),
                     message: srm.get('schedule-create-dialog-no-vehicles-message')
                  }, (dialog, status, params) => {
                     spa.navigateTo('');
                  });
               }
            })
            .fail(xhr => {
               // *Checking if the request's status is 401, sending the user to the login page if it is:
               if(xhr.status === 401){
                  spa.navigateTo('login');
                  return;
               }
               // *Showing a dialog-notice if internal error:
               dialogger.open('default-notice', {
                  title: srm.get('schedule-create-dialog-internal-error-title'),
                  message: srm.get('schedule-create-dialog-internal-error-message')
               }, (dialog, status, params) => {
                  spa.navigateTo('');
               });
            });
      }
   }



   function setup(vehicle_id){
      // *Setting user id the cache in the variable:
      selected_user = request.retrieveAccessInfo().id;
      // *Setting the id by parameter:
      selected_vehicle = vehicle_id;

      // *Showing the vehicle in app bar:
      scheduleCreateUtil().updateVehicleInfo(selected_vehicle);
      // *Showing the user in app bar:
      scheduleCreateUtil().updateUserInfo(selected_user);



      // *Clicking on a vehicle header:
      $('#schedule-create-vehicle-app-bar').on('click' , e => {

         // *Opening the vehicle-picker page:
         dialogger.open('vehicle-picker', {previous_selected_vehicle: selected_vehicle}, (dialog, status, params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Setting the id the vehicle selected by parameter:
               selected_vehicle = params.id;
               // *Updating the vehicle info selected:
               scheduleCreateUtil().updateVehicleInfo(selected_vehicle);
               break;
            }
         });
      });



      // *Checking the permission to the manage schedule:
      if(!permission.permissions.manage_schedules){
         // *If not permission:
         // *Disabling click the selected user:
         $('#schedule-create-user-app-bar').addClass('inactive').off('click');
      } else{
         // *Enabling click the selected user:
         $('#schedule-create-user-app-bar').on('click', e => {

            // *Opening the user-picker page:
            dialogger.open('user-picker', {previous_selected_user: selected_user}, (dialog, status, params) => {

               // *Checking if the case was positive:
               switch(status){
               case dialogger.DIALOG_STATUS_POSITIVE:
                  // *Setting the id the user selected by parameter:
                  selected_user = params.id;
                  // *Updating the user info selected:
                  scheduleCreateUtil().updateUserInfo(selected_user);
                  break;
               }
            });
         });
      }



      // *When the user submit the form:
      $('#schedule-create-form').submit((e) => {

         // *The default action of the event will not be triggered:
         e.preventDefault();

         scheduleCreateUtil().postSchedule(selected_user, selected_vehicle);
      });

      // *Checking if the params was all set correctly, which means that the user navigated through the schedules page:
      if(params && (params.id !== null && params.id !== undefined) && (params.date)){
         // *If they did:
         // *Setting the up button action:
         $('#schedule-create-up-button').on('click', e => {
            // *Navigating to schedules page with the same parameters:
            spa.navigateTo('schedules', {id: params.id, date: params.date});
         });
      } else{
         // *If they didn't:
         // *Setting the up button action:
         $('#schedule-create-up-button').on('click', e => {
            // *Navigating back to index page:
            spa.navigateTo('');
         });
      }
   }
});



// *When the user left the page:
spa.onLeft('schedule-create', (page) => {
   // *Removing the submit listeners from the form:
   $('#schedule-create-form').off('submit');

   // *Cleaning inputs when the page is left:
   $('#schedule-create-reason').val('');
   $('#schedule-create-start-date').val('');
   $('#schedule-create-start-time').val('');
   $('#schedule-create-end-date').val('');
   $('#schedule-create-end-time').val('');

   // *Removing the event onClick:
   $('#schedule-create-up-button').off('click');
   $('#schedule-create-user-app-bar').removeClass('inactive').off('click');
   $('#schedule-create-vehicle-app-bar').off('click');

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#schedule-create-section');
});



/**
 * Module that updates vehicle-info and user-info
 * @author Ralf Pablo Braga Soares
 */
function scheduleCreateUtil(){



   /**
   * Sends the schedule create request to REST
   * @param  {number} selected_vehicle    Id of vehicle
   * @param  {number} selected_user       Id of user
   * @author Dennis Sakaki Fujiki
   */
   function postSchedule(selected_user, selected_vehicle){

      // *Retrieving the values of the all fields:
      let text_reason = $('#schedule-create-reason').val();
      let date_startdate = $('#schedule-create-start-date').val();
      let time_starttime = $('#schedule-create-start-time').val();
      let date_enddate = $('#schedule-create-end-date').val();
      let time_endtime = $('#schedule-create-end-time').val();

      // *Joining date and time:
      let start_date_time = date_startdate + ' ' + time_starttime;
      let end_date_time = date_enddate + ' ' + time_endtime;

      // *Saving all values in a object_data:
      let object_data = {
         id_vehicle_fk: selected_vehicle,
         id_user_fk: selected_user,
         reason: text_reason,
         start_date: start_date_time,
         end_date: end_date_time
      };

      // *Sending a request to book this schedule:
      request.postSchedule(object_data)
         .done(data => {
            // *Showing the snack with the message:
            snack.open(srm.get('schedule-create-successful-snack'), snack.TIME_SHORT);
            // *Sending the user to the booking page with the schedule info:
            spa.navigateTo('schedules', {id: selected_vehicle, date: date_startdate});
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
            // *Case when the user or the vehicle referenced doesn't exist:
            case 'ERR_REF_NOT_FOUND':
               text.title = srm.get('schedule-create-dialog-error-ref-title');
               text.message = srm.get('schedule-create-dialog-error-ref-message');
               break;

            // *Case there is some required field not filled:
            case 'ERR_MISSING_FIELD':
               text.title = srm.get('schedule-create-dialog-error-missing-field-title');
               text.message = srm.get('schedule-create-dialog-error-missing-field-message');
               break;

            // *Case the informed schedule period isn't avaible:
            case 'ERR_INVALID_TIMESPAN':
               text.title = srm.get('schedule-create-dialog-error-timespan-title');
               text.message = srm.get('schedule-create-dialog-error-timespan-message');
               break;

            // *Case the vehicle isn't avaible in the specified period:
            case 'ERR_RES_UNAVAILABLE':
               text.title = srm.get('schedule-create-dialog-error-unavailable-title');
               text.message = srm.get('schedule-create-dialog-error-unavailable-message');
               break;

            // *Case the vehicle isn't active:
            case 'ERR_VEHICLE_NOT_ACTIVE':
               text.title = srm.get('schedule-create-dialog-error-vehicle-not-active-title');
               text.message = srm.get('schedule-create-dialog-error-vehicle-not-active-message');
               break;

            // *Case the user isn't active:
            case 'ERR_USER_NOT_ACTIVE':
               text.title = srm.get('schedule-create-dialog-error-user-not-active-title');
               text.message = srm.get('schedule-create-dialog-error-user-not-active-message');
               break;

            // *Case the user isn't authorized:
            case 'ERR_NOT_AUTHORIZED':
               text.title = srm.get('schedule-create-dialog-error-not-authorized-title');
               text.message = srm.get('schedule-create-dialog-error-not-authorized-message');
               break;

            default:
               text.title = srm.get('schedule-create-dialog-error-default-title');
               text.message = srm.get('schedule-create-dialog-error-default-message');
               break;
            }

            // *Open a dialog notice for the user:
            dialogger.open('default-notice', text);
         });
   }



   /**
    * Update the vehicle info
    * @param  {number} vehicle_id id the vehicle
    * @author Ralf Pablo Braga Soares
    */
   function updateVehicleInfo(vehicle_id){

      // *Replacing the vehicle in app bar:
      request.getVehicle(vehicle_id)
         .done(data => {

            // *Setting the vehicle's photo:
            $('#schedule-create-vehicle-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/' + data.photo + ')':'');

            // *Setting the vehicle's title and plate:
            $('#schedule-create-vehicle-title').text(data.title + " - " + data.plate);

            // *Setting the vehicle's year and manufacturer:
            $('#schedule-create-vehicle-description').text(data.year + " - " + data.manufacturer);
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
    * @param  {number} user_id id the user
    * @author Ralf Pablo Braga Soares
    */
   function updateUserInfo(user_id){

      // *Replacing the user in app bar:
      request.getUser(user_id)
         .done(data => {

            // *Setting the user's photo:
            $('#schedule-create-user-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');

            // *Setting the User name:
            $('#schedule-create-user-name').text(data.name);

            // *Setting the user's login:
            $('#schedule-create-user-login').text(data.login);
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
      postSchedule: postSchedule,
      updateVehicleInfo: updateVehicleInfo,
      updateUserInfo: updateUserInfo
   };
}
