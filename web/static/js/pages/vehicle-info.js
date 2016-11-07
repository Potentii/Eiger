

// *Browsing the vehicle-info page:
spa.onNavigate('vehicle-info', (page, params) => {
   // *Getting the user permission:
   let permission = request.retrieveUserPermissions();

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Checking the permission to the manage vehicles:
         if(!permission.permissions.manage_vehicles) $('#vehicle-info-edit-fab').hide();
         if(!permission.permissions.manage_vehicles) $('#vehicle-info-delete-fab').hide();

         // *Listing the vehicle:
         request.getVehicle(id)
            .done(data => {

               // *Checking if the vehicle is active:
               if(data.active === 1){
                  // *If true:
                  // *Showing div vehicle-info-active-true:
                  // *Hiding div vehicle-info-active-false:
                  $('#vehicle-info-active-true').parent().parent('.row').show();
                  $('#vehicle-info-active-false').parent().parent('.row').hide();

                 // *Checking if the vehicle isn't active:
              } else if (data.active === 0) {
                 // *If true:
                 // *Showing div vehicle-info-active-false:
                 // *Hiding div vehicle-info-active-true:
                  $('#vehicle-info-active-false').parent().parent('.row').show();
                  $('#vehicle-info-active-true').parent().parent('.row').hide();
               }

               // *Setting the vehicle's photo:
               $('#vehicle-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/'+ data.photo +')':'');

               // *Setting the vehicle's title and plate:
               $('#vehicle-info-title').text(data.title + ' - ' + data.plate);

               // *Setting the vehicle's year and manufacturer:
               $('#vehicle-info-description').text(data.year + ' - ' + data.manufacturer);

               // *Setting the vehicle's renavam and registred date:
               $('#vehicle-info-renavam').text(data.renavam);

               $('#vehicle-info-owner').text(data.owner);

               let date = new Date(data.date);
               $('#vehicle-info-date').text(df.asFullDate(date));
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

      // *When a user to click in update button:
      $('#vehicle-info-edit-fab').on('click', e => {
          // *Sending the user's to the vehicle-update page:
          spa.navigateTo('vehicle-update', {id: id});
      });

      // *When a user clicks on delete button:
      $('#vehicle-info-delete-fab').on('click', e => {
         // *Asking if the user wants to delete:
         dialogger.open('default-consent', {title: srm.get('vehicle-info-dialog-consent-delete-title'), message: srm.get('vehicle-info-dialog-consent-delete-message')}, (dialog, status, params) => {
            // *Checking the button clicked:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *If the user clicked at 'ok':
               // *Deleting the vehicle:
               deleteVehicle(id);
               break;
            }
         });
      });

   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});



// *When user left the page:
spa.onLeft('vehicle-info', (page) => {
   // *Removing the event click:
   $('#vehicle-info-edit-fab').off('click');
   $('#vehicle-info-delete-fab').off('click');

   // *Showing the 'Edit vehicle and Delete vehicle' FAB:
   $('#vehicle-info-edit-fab').show();
   $('#vehicle-info-delete-fab').show();
});



/**
 * Deletes a vehicle, and handles the response
 * @param  {number} id The vehicle's id to delete
 * @author Guilherme Reginaldo Ruella
 */
function deleteVehicle(id){
   request.deleteVehicle(id)
      .done(data => {
         // *Showing a success snackbar:
         snack.open(srm.get('vehicle-info-delete-successful-snack'), snack.TIME_SHORT);
         // *Going back to vehicles list:
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
            text.title = srm.get('vehicle-info-dialog-error-not-found-title');
            text.message = srm.get('vehicle-info-dialog-error-not-found-message');
            break;
         case 'ERR_REF_LEFT':
            // *If the resource has references left:
            text.title = srm.get('vehicle-info-dialog-error-ref-left-title');
            text.message = srm.get('vehicle-info-dialog-error-ref-left-message');
            break;
         default:
            // *If none of above:
            text.title = srm.get('vehicle-info-dialog-error-default-title');
            text.message = srm.get('vehicle-info-dialog-error-default-message');
            break;
         }

         // *Opening the notice dialog:
         dialogger.open('default-notice', text);
      });
}
