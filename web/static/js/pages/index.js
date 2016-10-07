
// *When navigate the page Index:
spa.onNavigate('', (page, params) => {

      // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *List the vehicles:
      requestVehicles();

   }
});


// *When user left the page:
spa.onUnload('', (page, params) => {
   var card_ul = $('#vehicles-list');
   card_ul.empty();
   card_ul.off('click');
});



/**
* Requests the vehicles to the database
* @author Ralf Pablo Braga Soares
*/
function requestVehicles(){

   // *Getting the key and the token:
   let auth = getAuthentication();


   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: 'http://localhost:3000/api/v1/vehicles',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {
      // *Father ul:
      let card_ul = $('#vehicles-list');

      // *Iterate and create vehicles list:
      data.forEach(function(element, index){
         // *Father li:
         let card_li = $('<li>');
         $(card_li).attr("data-id", element.id).addClass('card box raised').appendTo(card_ul);

         // *Divs layout horizontal/vertical:
         let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);
         let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', 'url(http://localhost:3000/media/v/p/'+ element.photo +')').appendTo(horizontal_layout_div);
         let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

         // *Spans:
         let vehicle_title = $('<span>').addClass('primary').text(element.title+" - "+element.plate).appendTo(vertical_layout_div);
         $('<br>').appendTo(vehicle_title);
         let vehicle_description = $('<span>').addClass('secondary').text(element.year+" - "+element.type+" - "+element.manufacturer).appendTo(vertical_layout_div);

         // *Divs line horizontal/vertical:
         let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
         let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);

         let button_ul = $('<ul>').addClass('schedules flex-horizontal-layout').appendTo(card_li);
         requestSchedules(element.id, button_ul);
      });

      // *Event by clicking on a vehicle:
      card_ul.on('click', 'li > .info', function(){
         var id = $(this).parent('li').data('id');
         // *Sending the id the li by parameter:
         spa.navigateTo('vehicle-info', {id: id});
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}



/**
 * Request all the schedules from vehicle
 * @param  {number} id        The vehicle's id
 * @param  {button} button_ul The schedules container
 * @author Willian Conti Rezende
 */
function requestSchedules(id, button_ul) {

   let auth = getAuthentication();
   let dates = getNextDays(14);

   dates.forEach((element, index) => {

      let button_li = $('<li>').addClass('vertical-layout').attr('data-date', df.asMysqlDate(element)).appendTo(button_ul);
      let date_span = $('<span>').addClass('secondary').text(df.asShortDate(element)).appendTo(button_li);
      let button_schedule = $('<button>').attr("type", 'button').addClass('round').appendTo(button_li);

      $.ajax({
         url: 'http://localhost:3000/api/v1/vehicles/'+id+'/reservations/'+ df.asMysqlDate(element),
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      }).done((data, textStatus, xhr) => {
         button_schedule.text(data.length);
      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
   });
}



/**
 * Retrieves an array of days, begining on the given date
 * @param  {number} days_quantity Number of days
 * @param  {Date} from_date       The start date
 * @author Guilherme Reginaldo Ruella
 */
function getNextDays(days_quantity, from_date){
   var vet = [];

   for(var i=0; i<days_quantity; i++) {
      var current_date = from_date || new Date('2016-10-01 00:00:00');
      var next_date_ms = current_date.setDate(current_date.getDate() + i);
      var next_date = new Date(next_date_ms);
      vet.push(next_date);
   }
   return vet;
}
