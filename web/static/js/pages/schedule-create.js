


// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {

         // *:
         request.getVehicle(id)
            .done((data, textStatus, xhr) => {
               // *Setting the vehicle's photo:
               $('#schedule-create-vehicle-photo').css('background-image', 'url(' + rest_url + '/media/v/p/' + data.photo + ')');

               // *Setting the vehicle's title and plate:
               $('#schedule-create-vehicle-title').text(data.title + " - " + data.plate);

               // *Setting the vehicle's type, year and manufacturer:
               $('#schedule-create-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });

            request.getAuth()
               .done((data, textStatus, xhr) => {

                  // *Setting the User name:
                  $('#schedule-create-user-name').text(data.user.name);
               })
               .fail((xhr, textStatus, err) => {
                  console.log(textStatus);
               });

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
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to schedules page:
      spa.navigateTo('schedules');
   }
});



// *When the user left the page:
spa.onUnload('schedule-create', (page)=> {
   // *Removing the submit listeners from the form:
   $('#schedule-create-form').off('submit');
});
