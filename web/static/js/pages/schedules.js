
spa.onNavigate('schedules', (page, params) => {

   // *Checking if the user was authenticated:
if(authenticated == true) {
   // *If true:
   // *List the vehicles:
   requestVehicle();
   requestSchedules();

}
});

// *Define ul like empty after unload the page:
spa.onUnload('schedules', (page, params) => {
   $('#schedules-list').empty();
   var schedules_ul = $('<ul>');
   $(schedules_ul).attr("id", 'schedules-list').addClass('list content-before-fab');
});

function requestVehicle(){
   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/1',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {

      $('#schedules-vehicle-photo').css('background-image', 'url('+ rest_url +'/media/v/p/'+ data.photo +')');

      $('#schedules-vehicle-title').text(data.title+" - "+data.plate);
      $('#schedules-vehicle-description').text(data.type+" - "+data.year+" - "+data.manufacturer);

      $('#schedules-vehicle-date').text('30/09/2016');

   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}


function requestSchedules(){
   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/schedules',
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
         let schedules_user = $('<span>').addClass('primary').text('Ralf Pablo').appendTo(vertical_layout_div);
         let schedules_reason = $('<span>').addClass('secondary').text(element.reason).appendTo(vertical_layout_div);

         let schedules_duration_div = $('<div>').addClass('schedule-duration-output').appendTo(schedules_li);
         let schedules_start_date = $('<span>').text(new Date(element.start_date)).appendTo(schedules_duration_div);
         let schedules_start_time = $('<span>').addClass('secondary').text().appendTo(schedules_duration_div);
         let icon = $('<i>').addClass('material-icons secondary').text('more_vert').appendTo(schedules_duration_div);
         let schedules_end_time = $('<span>').addClass('secondary').text().appendTo(schedules_duration_div);
         let schedules_end_date = $('<span>').text(new Date(element.end_date)).appendTo(schedules_duration_div);
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
