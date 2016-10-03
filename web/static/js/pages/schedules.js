
spa.onNavigate('schedules', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      let date = params.date;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *List the reserves of that vehicle:
         requestVehicleSchedules(id, date);
         requestUsersSchedules(id, date);
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Send it to the index page:
      spa.navigateTo('');
   }
});



// *Define ul like empty after unload the page:
spa.onUnload('schedules', (page, params) => {
   $('#schedules-list').empty();
   var schedules_ul = $('<ul>');
   $(schedules_ul).attr("id", 'schedules-list').addClass('list content-before-fab');
});



function requestVehicleSchedules(id, date) {
   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/' + id,
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {

      //
      $('#schedules-vehicle-photo').css('background-image', 'url('+ rest_url +'/media/v/p/'+ data.photo +')');

      //
      $('#schedules-vehicle-title').text(data.title+" - "+data.plate);
      $('#schedules-vehicle-description').text(data.type+" - "+data.year+" - "+data.manufacturer);

      //
      $('#schedules-vehicle-date').text(date);

   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}



function requestUsersSchedules(id, date) {
   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/' + id + '/reservations/' + date,
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {
      console.log(data);
      let schedules_ul = $('#schedules-list');

      // *Iterate and create vehicles list:
      data.forEach(function(element, index){

         // *Father li:
         let schedules_li = $('<li>');
         $(schedules_li).addClass('card box raised').appendTo(schedules_ul);

         // *Divs layout horizontal/vertical:
         let vertical_layout_div = $('<div>').addClass('user vertical-layout').appendTo(schedules_li);
         let schedules_user = $('<span>').addClass('primary').text(element.user.name).appendTo(vertical_layout_div);
         let schedules_reason = $('<span>').addClass('secondary').text(element.schedule.reason).appendTo(vertical_layout_div);

         //
         let schedules_duration_div = $('<div>').addClass('schedule-duration-output').appendTo(schedules_li);

         //
         let start_date = new Date(element.schedule.start_date);
         let schedules_start_date = $('<span>').text(df.asShortDate(start_date));
         $(schedules_start_date).appendTo(schedules_duration_div);

         //
         let start_time = new Date(element.schedule.start_date);
         let schedules_start_time = $('<span>').addClass('secondary').text(df.asShorterTime(start_time));
         $(schedules_start_time).appendTo(schedules_duration_div);

         // *Icon between dates:
         let icon = $('<i>').addClass('material-icons secondary').text('more_vert');
         $(icon).appendTo(schedules_duration_div);

         //
         let end_time = new Date(element.schedule.end_date);
         let schedules_end_time = $('<span>').addClass('secondary').text(df.asShorterTime(end_time));
         $(schedules_end_time).appendTo(schedules_duration_div);

         //
         let end_date = new Date(element.schedule.end_date);
         let schedules_end_date = $('<span>').text(df.asShortDate(end_date));
         $(schedules_end_date).appendTo(schedules_duration_div);
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
