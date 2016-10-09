// *When the user navigate to the vehicle-update page:
spa.onNavigate('vehicle-update', (page, params) => {
   let vehicle_photo_base64 = '';

   // *Checking if the params is diferent undefined or null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Show the page to update vehicle:
         request.getVehicle(1)
            .done((data, textStatus, xhr) => {

               // *Setting the vehicle's photo:
               $('#vehicle-update-pic').css('background-image', 'url(' + rest_url + '/media/v/p/'+ data.photo +')');

               // *Setting the vehicle's update title:
               $('#vehicle-update-title').val(data.title);

               // *Setting the vehicle's update manufacturer:
               $('#vehicle-update-manufacturer').val(data.manufacturer)

               // *Setting the vehicle's update type:
               $('#vehicle-update-type').val(data.type);

               // *Setting the Vechicle's update year:
               $('#vehicle-update-year').val(data.year);

               // *Setting the Vechicle's update plate:
               $('#vehicle-update-plate').val(data.plate);

               // *Setting the vehicle's update plate:
               $('#vehicle-update-renavam').val(data.renavam);

            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });


         $('#vehicle-update-pic').on('change', (e) => {
            let vehicle_pic_file = document.querySelector('#vehicle-update-pic').files[0];
            file_encoder.asBase64(vehicle_pic_file, res => {
               vehicle_photo_base64 = res;
               $('#vehicle_pic_file').css('background-image');
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
      //spa.navigateTo('');
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

   // *Getting data of inputs:
   let vehicle_pic = $('#vehicle-update-pic').val();
   let vehicle_title = $('#vehicle-update-title').val();
   let vehicle_manufacturer = $('#vehicle-update-manufacturer').val();
   let vehicle_type = $('#vehicle-update-type').val();
   let vehicle_year = $('#vehicle-update-year').val();
   let vehicle_plate = $('#vehicle-update-plate').val();
   let vehicle_revavam = $('#vehicle-update-renavam').val();

   
   let data_update_vehicle = {
      title: vehicle_title,
      manufacturer: vehicle_manufacturer,
      type: vehicle_type,
      year: vehicle_year,
      plate: vehicle_plate,
      renavam: vehicle_revavam,
      photo: vehicle_photo_base64
   }



   // *Sending a Update Vehicle to the table vehicle on database:
      request.putVehicle(id, data_update_vehicle)
         .done((data, textStatus, xhr) => {
         saveAuthentication(data);
         authenticated = true;
         spa.navigateTo('');
         snack.show('Vehicle updated', snack.TIME_SHORT);

   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
