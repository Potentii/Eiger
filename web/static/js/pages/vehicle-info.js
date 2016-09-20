
// *When navigate the page vehicle-info:
spa.onNavigate('vehicle-info', (page, params) => {
   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      console.log(params.id);
      console.log(vehicle);

      // *Is diferent of numm ou undefined:
      // *Make request to the data base:
      /*$.ajax({
         url: 'http://localhost:3000/api/v1/vehicle/'+id,
         method: 'GET'
         }).done((data, textStatus, xhr) => {

         }).fail((xhr, textStatus, err) => {
            console.log(textStatus);
         });*/
   } else {
      // *Is not diferent of numm ou undefined:
      // *Send it to the index page:
      spa.navigateTo('');
   }
});
