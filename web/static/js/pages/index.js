
// *When navigate the page Index:
spa.onNavigate('', (page, params) => {

      // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *List the vehicles:
      requestVehicles();

   }
});

// *Define ul like empty after unload the page:
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
      url: rest_url + '/api/v1/vehicles',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {
      // *Father ul:
      let card_ul = $('#vehicles-list');

      // *Iterate and create vehicles list:
      data.forEach((element, index) => {
         // *Father li:
         let card_li = $('<li>');
         $(card_li).attr("data-id", element.id).addClass('card box raised').appendTo(card_ul);

         // *Divs layout horizontal/vertical:
         let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);
         let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', 'url('+ rest_url + '/media/v/p/' + element.photo +')').appendTo(horizontal_layout_div);
         let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

         // *Spans:
         let vehicle_title = $('<span>').addClass('primary').text(element.title+" - "+element.plate).appendTo(vertical_layout_div);
         $('<br>').appendTo(vehicle_title);
         let vehicle_description = $('<span>').addClass('secondary').text(element.year+" - "+element.type+" - "+element.manufacturer).appendTo(vertical_layout_div);

         // *Divs line horizontal/vertical:
         let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
         let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);
         // *--------------------------HERE'S THE PART OF THE BALLS---------------------------------:

         let button_ul = $('<ul>').addClass('schedules flex-horizontal-layout').appendTo(card_li);
         requestSchedules(element.id, button_ul);
      });

      // *Event by clicking on a vehicle:
      card_ul.on('click', 'li > .info', function(){
         var id = $(this).parent('li').data('id');

         // *Sending the id the li by parameter:
         spa.navigateTo('vehicle-info', {id: id});
      });

      // *Event by clicking on a **********:
      $('li').on('click', '.info', function(){
         let id = $(this).parent('li').parent('li').data("id");
         let date = $(this).parent('li').data("date");
         console.log(id);
         console.log(date);
         // *Sending the id the li by parameter:
         spa.navigateTo('schedules', {id: id, date: date});
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}


function requestSchedules(id, button_ul) {

   let auth = getAuthentication();
   let dates = getNextDays(6);

   dates.forEach((element, index) => {

      let button_li = $('<li>').addClass('vertical-layout').attr('data-date', df.asMysqlDate(element)).appendTo(button_ul);
      let date_span = $('<span>').addClass('secondary').text(df.asShortDate(element)).appendTo(button_li);
      let button_schedule = $('<button>').attr("type", 'button').addClass('round').css('background-color',  'rgb(230, 180, 10)').appendTo(button_li);

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



function getNextDays(days_quantity){
   var vet = [];

   for(var i=0; i<days_quantity; i++) {
      var data_atual = new Date();
      var data_futura_ms = data_atual.setDate(data_atual.getDate() + i);
      var data_futura = new Date(data_futura_ms);
      vet.push(data_futura);
   }
   return vet;
}
