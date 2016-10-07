

/**
 * Encodes a file into a Base64 URL
 * @param  {File} file        File to select
 * @param  {function} onReady The encode completion callback
 * @author Guilherme Reginaldo Ruella
 */
function getBase64(file, onReady){
   var reader = new FileReader();
   reader.addEventListener('load', function(){
      onReady(reader.result);
   }, false);

   if(file){
      reader.readAsDataURL(file);
   }
}


// *When navigate the page vehicle-update:
spa.onNavigate('vehicle-update', (page, params) => {
   let vehicle_photo_base64 = '';


   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Show the page to update vehicle:
         //spa.navigateTo('vehicle-update');
         $('#vehicle-update-pic').on('change', (e) => {
            let vehicle_pic_file = document.querySelector('#vehicle-update-pic').files[0];
            getBase64(vehicle_pic_file, function(res){
               vehicle_photo_base64 = res;
            });
         });

         // Button to call a function updateVechile and prevent te action default of browser happen
         $('#vehicle-update-form').on('submit', (e) => {
            e.preventDefault();
            updateVehicle(id);

         });



      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Send it to the index page:
      spa.navigateTo('');
   }
});


 //Cleaning listernes from this page
spa.onUnload('vehicle-update', (page) => {
   $('#vehicle-update-form').off('submit');
   $('#vehicle-update-pic').off('change');
});



/**
 * Sends the vehicle update request to REST
 * @param  {number} id  The number of id from vehicle
 * @author Willian Conti Rezende
 */
function updateVehicle(id){

   // *Getting the key and the token:
   let auth = getAuthentication();


   let vehicle_pic = $('#vehicle-update-pic').val();
   let vehicle_title = $('#vehicle-update-title').val();
   let vehicle_manufacturer = $('#vehicle-update-manufacturer').val();
   let vehicle_type = $('#vehicle-update-type').val();


   // *Sending a Update Vehicle to the table vehicle on data base:
   $.ajax({
      url: 'http://localhost:3000/api/v1/vehicles/'+id,
      method: 'PUT',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key},
      data: JSON.stringify({title: vehicle_title, manufacturer: vehicle_manufacturer, type:vehicle_type, photo: vehicle_photo_base64})
   }).done((data, textStatus, xhr) => {
      saveAuthentication(data);
      authenticated = true;
      spa.navigateTo('');
      snack.show('Vehicle updated', snack.TIME_SHORT);




   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
