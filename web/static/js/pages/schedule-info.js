

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
                  // *Showing schedule-info-confirmed-true:
                  // *Hiding schedule-info-confirmed-false:
                  $('#schedule-info-confirmed-true').parent().parent('.row').show();
                  $('#schedule-info-confirmed-false').parent().parent('.row').hide();

                 // *Checking if the user isn't active:
              } else if (data.confirmed === 0) {
                 // *If true:
                 // *Showing schedule-info-confirmed-false:
                 // *Hiding schedule-info-confirmed-true:
                  $('#schedule-info-confirmed-false').parent().parent('.row').show();
                  $('#schedule-info-confirmed-true').parent().parent('.row').hide();
               }

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

                     // *Setting the user's photo:
                     $('#schedule-info-owner-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');
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
    $('#schedule-info-edit-fab').on('click', function(){
        // *Sending the id of the schedule-update by parameter:
        spa.navigateTo('schedule-update', {id: id});
     });
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('schedules');
   }
});


// *When user left the page:
spa.onUnload('schedule-info', (page) => {

   // *Removing the event click:
   $('#schedule-info-edit-fab').off('click');
});
