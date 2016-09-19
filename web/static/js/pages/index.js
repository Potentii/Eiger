
let vehicle = [
   {vehicle_id: 1, vehicle_title: 'Fiesta', vehicle_plate: 'HDO1775', vehicle_type: 'Hatch', vehicle_manufacturer: 'Ford', vehicle_photo: ''},
   {vehicle_id: 2, vehicle_title: 'Fusion', vehicle_plate: 'HDO2375', vehicle_type: 'Sedan', vehicle_manufacturer: 'Ford', vehicle_photo: ''},
   {vehicle_id: 3, vehicle_title: 'Umbrela', vehicle_plate: 'HDO1234', vehicle_type: 'Pickup', vehicle_manufacturer: 'Ford', vehicle_photo: ''},
   {vehicle_id: 4, vehicle_title: 'Vocation', vehicle_plate: 'HDO1545', vehicle_type: 'Hatch', vehicle_manufacturer: 'Ford', vehicle_photo: ''},
   {vehicle_id: 5, vehicle_title: 'BAT MOVEL', vehicle_plate: 'XXXXXX', vehicle_type: 'TOOP', vehicle_manufacturer: 'Author not found', vehicle_photo: ''}
];

// *Define ul like empty after unload the page:
spa.onUnload('', (page, params) => {
   $('#vehicles-list').empty();
   let card_ul = $('<ul>');
   $(card_ul).attr("id", 'vehicles-list').addClass('list');
});

// *When navigate the page Index:
spa.onNavigate('', (page, params) => {

   /*$.ajax({
          url: 'http://localhost:3000/api/v1/vehicle,
          method: 'GET'
      }).done((data, textStatus, xhr) => {

      }).fail((xhr, textStatus, err) => {
          console.log(textStatus);
      });*/

   // *Father ul:
   let card_ul = $('#vehicles-list');
   // *Iteration in the array vehicle:
   vehicle.forEach(function(element, index){
      // *Name the image like number
      let number_img = index + 1;
      // *Father li:
      let card_li = $('<li>');
      $(card_li).attr("data-id", element.vehicle_id).addClass('card box raised').appendTo(card_ul);
      // *Divs layout horizontal/vertical:
      let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);
      let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', 'url(./static/res/'+number_img+'.jpg)').appendTo(horizontal_layout_div);
      let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);
      // *Spans:
      let vehicle_title = $('<span>').addClass('primary').text(element.vehicle_title).appendTo(vertical_layout_div);
      let vehicle_description = $('<span>').addClass('secondary').text(element.vehicle_manufacturer+" - "+element.vehicle_type ).appendTo(vertical_layout_div);
      // *Divs line horizontal/vertical:
      let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
      let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);
// *--------------------------HERE'S THE PART OF THE BALLS---------------------------------:

   });

   // *Event by clicking on a vehicle:
   $('li').on('click', '.info', function(){
      var id = $(this).parent('li').data("id");

      // *Sending the id the li by parameter:
      spa.navigateTo('vehicle-info', {id: id});
   });

/*tryToValidate((users) => {
      requestUsers();
   }, (errorMessage) => {
      console.log(errorMessage);
   });*/

});
/*
function tryToValidate(success, fail){
   let auth = getAuthorization();
   $.ajax({
      url: 'http://localhost:3000/auth',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.login}
   }).done((data, textStatus, xhr) => {
      success();
   }).fail((xhr, textStatus, err) => {
      fail("Deu merda!");
   });
}

function requestUsers(){
   let auth = getAuthorization();
   $.ajax({
      url: 'http://localhost:3000/api/v1/users',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.login}
   }).done((data, textStatus, xhr) => {
      console.log(data);
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
*/
