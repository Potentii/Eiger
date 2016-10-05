


// *Browsing the schedules page:
spa.onNavigate('schedules', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      let date = params.date;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Showing the vehicle in app bar:
         requestVehicle(id, date);

         // *Listing the reserves of that vehicle:
         buildReservationsOnDate(id, date);
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});



// *Defining ul like empty after unload the page:
spa.onUnload('schedules', (page, params) => {

   // *Setting the element ul to the variable:
   var schedules_ul = $('#schedules-list');

   // *Wiping the element ul:
   schedules_ul.empty();
});



/**
 * Requests the vehicle to the database
 * @param  {number} id number ID the vehicle
 * @param  {date} date schedule date
 * @author Ralf Pablo Braga Soares
 */
function requestVehicle(id, date) {

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requesting Vehicle to the vehicle data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/' + id,
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {

      // *Setting the vehicle's photo:
      $('#schedules-vehicle-photo').css('background-image', 'url(' + rest_url + '/media/v/p/' + data.photo + ')');

      // *Setting the vehicle's title and plate:
      $('#schedules-vehicle-title').text(data.title + " - " + data.plate);

      // *Setting the vehicle's type, year and manufacturer:
      $('#schedules-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

      // *Setting the vehicle schedule date:
      $('#schedules-vehicle-date').text(date);

   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}



/**
 * Requests reservations users on date
 * @param  {number} id number ID the vehicle
 * @param  {date} date schedule date
 * @author Ralf Pablo Braga Soares
 */
function buildReservationsOnDate(id, date) {

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requesting all reservations that date for that vehicle:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/' + id + '/reservations/' + date,
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {

      // *Building the schedule's ul:
      let schedules_ul = $('#schedules-list');

      // *Iterating and creating the schedules list:
      data.forEach(function(element, index){

         // *Building the schedule's li:
         let schedules_li = $('<li>');
         schedules_li.addClass('card box raised').appendTo(schedules_ul);

         // *Building the schedule's div:
         let vertical_layout_div = $('<div>').addClass('user vertical-layout').appendTo(schedules_li);

         // *Building and setting the name and reason of the user:
         let schedules_user = $('<span>').addClass('primary').text(element.user.name).appendTo(vertical_layout_div);
         let schedules_reason = $('<span>').addClass('secondary').text(element.schedule.reason).appendTo(vertical_layout_div);

         // *Building the schedule's duration div:
         let schedules_duration_div = $('<div>').addClass('schedule-duration-output').appendTo(schedules_li);

         // *Building and setting the schedule start date:
         let start_date = new Date(element.schedule.start_date);
         let schedules_start_date = $('<span>').text(df.asShortDate(start_date));
         schedules_start_date.appendTo(schedules_duration_div);

         // *Building and setting the schedule start time:
         let start_time = new Date(element.schedule.start_date);
         let schedules_start_time = $('<span>').addClass('secondary').text(df.asShorterTime(start_time));
         schedules_start_time.appendTo(schedules_duration_div);

         // *Icon between dates:
         let icon = $('<i>').addClass('material-icons secondary').text('more_vert');
         $(icon).appendTo(schedules_duration_div);

         // *Building and setting the schedule end time:
         let end_time = new Date(element.schedule.end_date);
         let schedules_end_time = $('<span>').addClass('secondary').text(df.asShorterTime(end_time));
         schedules_end_time.appendTo(schedules_duration_div);

         // *Building and setting the schedule end date:
         let end_date = new Date(element.schedule.end_date);
         let schedules_end_date = $('<span>').text(df.asShortDate(end_date));
         schedules_end_date.appendTo(schedules_duration_div);

      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}