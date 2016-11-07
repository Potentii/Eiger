

// *Browsing the schedule-info page:
spa.onNavigate('schedule-info', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the reserve info of that vehicle:
         request.getSchedule(id)
            .done(data => {

               // *Checking if the reserve is confirmed:
               if(data.confirmed === 1){
                  // *If true:

                  $('#schedule-info-confirmation-fab').text('lock_outline');
                  // *Showing schedule-info-confirmed-true:
                  // *Hiding schedule-info-confirmed-false:
                  $('#schedule-info-confirmed-true').parent().parent('.row').show();
                  $('#schedule-info-confirmed-false').parent().parent('.row').hide();

               // *Checking if the user isn't active:
               } else if (data.confirmed === 0) {
                  $('#schedule-info-confirmed-false').parent().parent('.row').show();
                  // *If true:

                  $('#schedule-info-confirmation-fab').text('lock_open');
                  // *Showing schedule-info-confirmed-false:
                  // *Hiding schedule-info-confirmed-true:
                  $('#schedule-info-confirmed-false').parent().parent('.row').show();
                  $('#schedule-info-confirmed-true').parent().parent('.row').hide();
               }

               // *Setting the schedule code:
               $('#schedule-info-code').text(data.id);

               // *Setting the schedule reason:
               $('#schedule-info-reason').text(data.reason);

               // *Setting the schedule start date:
               let start_date = new Date(data.start_date);
               $('#schedule-info-start-date').text(df.asShortDate(start_date));

               // *Setting the schedule start time:
               let start_time = new Date(data.start_date);
               $('#schedule-info-start-time').text(df.asShorterTime(start_time));

               // *Setting the schedule end time:
               let end_time = new Date(data.end_date);
               $('#schedule-info-end-time').text(df.asShorterTime(end_time));

               // *Setting the schedule end date:
               let end_date = new Date(data.end_date);
               $('#schedule-info-end-date').text(df.asShortDate(end_date));

               // *Setting the schedule's create date:
               let create_date = new Date(data.date);
               $('#schedule-info-date').text(df.asFullDate(create_date));

               // *When the user clicks to toggle the schedule status:
               $('#schedule-info-confirmation-fab').on('click', e => {
                  // *Toggling the schedule status:
                  changeScheduleStatus(id);
               });



               // *Showing the vehicle in app bar:
               request.getVehicle(data.id_vehicle_fk)
                  .done(data => {

                     // *Setting the vehicle's photo:
                     $('#schedule-info-vehicle-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/' + data.photo + ')':'');

                     // *Setting the vehicle's title and plate:
                     $('#schedule-info-vehicle-title').text(data.title + " - " + data.plate);

                     // *Setting the vehicle's type, year and manufacturer:
                     $('#schedule-info-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

                  })
                  .fail(xhr => {
                     // *Checking if the request's status is 401, sending the user to the login page if it is:
                     if(xhr.status === 401){
                        spa.navigateTo('login');
                        return;
                     }
                     console.log(xhr.responseJSON);
                  });

               // *Showing the user in app bar:
               request.getUser(data.id_user_fk)
                  .done(data => {

                     // *Setting the user's photo:
                     $('#schedule-info-user-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');

                     // *Setting the user's username:
                     $('#schedule-info-user-name').text(data.name);

                     // *Setting the user's login:
                     $('#schedule-info-user-login').text(data.login);
                  })
                  .fail(xhr => {
                     // *Checking if the request's status is 401, sending the user to the login page if it is:
                     if(xhr.status === 401){
                        spa.navigateTo('login');
                        return;
                     }
                     console.log(xhr.responseJSON);
                  });

               // *Showing photo the who booked:
               request.getUser(data.id_user_owner_fk)
                  .done(data => {

                     // *Setting the owners's photo:
                     $('#schedule-info-owner-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');
                     // *Setting the owners's name:
                     $('#schedule-info-owner-name').text(data.name);
                     // *Setting the owners's login:
                     $('#schedule-info-owner-login').text(data.login);
                  })
                  .fail(xhr => {
                     // *Checking if the request's status is 401, sending the user to the login page if it is:
                     if(xhr.status === 401){
                        spa.navigateTo('login');
                        return;
                     }
                     console.log(xhr.responseJSON);
                  });
            });
      }

      // *When a user to click in update button:
      $('#schedule-info-edit-fab').on('click', e => {
         // *Sending the id of the schedule-update by parameter:
         spa.navigateTo('schedule-update', {id: id});
      });

      // *When a user clicks on delete button:
      $('#schedule-info-delete-fab').on('click', e => {
         // *Asking if the user wants to delete:
         dialogger.open('default-consent', {title: srm.get('schedule-info-dialog-consent-delete-title'), message: srm.get('schedule-info-dialog-consent-delete-message')}, (dialog, status, params) => {
            // *Checking the button clicked:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *If the user clicked at 'ok':
               // *Deleting the schedule:
               deleteSchedule(id);
               break;
            }
         });
      });

   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('schedules');
   }
});



// *When user left the page:
spa.onLeft('schedule-info', (page) => {
   // *Removing the event click:
   $('#schedule-info-edit-fab').off('click');
   $('#schedule-info-delete-fab').off('click');
   $('#schedule-info-confirmation-fab').off('click');
});



/**
 * Changes the status of the schedule
 * @param  {number} id The schedule's id to change status
 * @author Guilherme Reginaldo Ruella
 */
function changeScheduleStatus(id){
   // *Getting the schedule's current info:
   request.getSchedule(id)
      .done(data => {
         // *Update the status os this schedule:
         request.putSchedule(id, {confirmed: !data.confirmed})
            .done(() => {
               // *Checking if the schedule was confirmed before:
               if(data.confirmed){
                  // *If it was:
                  // *Shoing a successful snack:
                  snack.open(srm.get('schedule-info-confirmation-true-success'), snack.TIME_SHORT);
               } else{
                  // *If it wasn't:
                  // *Shoing a successful snack:
                  snack.open(srm.get('schedule-info-confirmation-false-success'), snack.TIME_SHORT);
               }
               // *Going back to previous page:
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
                  text.title = srm.get('schedule-info-confirmation-dialog-error-ref-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-ref-message');
                  break;

               // *When the vehicle selected is not active:
               case 'ERR_VEHICLE_NOT_ACTIVE':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-vehicle-not-active-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-vehicle-not-active-message');
                  break;

               // *When the user is not active:
               case 'ERR_USER_NOT_ACTIVE':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-user-not-active-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-user-not-active-message');
                  break;

               // *When the user not authorized:
               case 'ERR_NOT_AUTHORIZED':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-not-authorized-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-not-authorized-message');
                  break;

               // *When the vehicle selected is not availabe:
               case 'ERR_RES_UNAVAILABLE':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-unavailable-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-unavailable-message');
                  break;


               // *When the period is invalid:
               case 'ERR_INVALID_TIMESPAN':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-timespan-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-timespan-message');
                  break;

               // *When schedule not found:
               case 'ERR_NOT_FOUND':
                  text.title = srm.get('schedule-info-confirmation-dialog-error-notfound-schedule-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-notfound-schedule-message');
                  break;

               default:
                  text.title = srm.get('schedule-info-confirmation-dialog-error-default-title');
                  text.message = srm.get('schedule-info-confirmation-dialog-error-default-message');
                  break;
               }

               // *Opening a dialog notice for the user:
               dialogger.open('default-notice', text);
            });
      })
      .fail(xhr => {
         console.log(xhr.responseJSON);
      });
}



/**
 * Deletes a schedule, and handles the response
 * @param  {number} id The schedule's id to delete
 * @author Guilherme Reginaldo Ruella
 */
function deleteSchedule(id){
   request.deleteSchedule(id)
      .done(data => {
         // *Showing a success snackbar:
         snack.open(srm.get('schedule-info-delete-successful-snack'), snack.TIME_SHORT);
         // *Going back to schedule list:
         spa.goBack();
      })
      .fail(xhr => {
         // *Checking if the request's status is 401, sending the user to the login page if it is:
         if(xhr.status === 401){
            spa.navigateTo('login');
            return;
         }
         // *Declaring the dialog text object:
         let text = {title: '', message: ''};

         // *Checking the error code:
         switch(xhr.responseJSON.err_code){
         case 'ERR_NOT_FOUND':
            // *If the resource could not be found:
            text.title = srm.get('schedule-info-dialog-error-not-found-title');
            text.message = srm.get('schedule-info-dialog-error-not-found-message');
            break;
         case 'ERR_NOT_AUTHORIZED':
            // *If the user doesn't have authorization to remove this resource:
            text.title = srm.get('schedule-info-dialog-error-not-authorized-title');
            text.message = srm.get('schedule-info-dialog-error-not-authorized-message');
            break;
         default:
            // *If none of above:
            text.title = srm.get('schedule-info-dialog-error-default-title');
            text.message = srm.get('schedule-info-dialog-error-default-message');
            break;
         }

         // *Opening the notice dialog:
         dialogger.open('default-notice', text);
      });
}
