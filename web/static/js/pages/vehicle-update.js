// *When the user navigate to the vehicle-update page:
spa.onNavigate('vehicle-update', (page, params) => {
   let vehicle_photo_base64 = undefined;

   // *Playing the inflation animation on the FAB:
   anim.inflate($('#vehicle-update-done-fab'));

   // *Checking if the params is diferent undefined or null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Show the page to update vehicle:
         request.getVehicle(id)
            .done((data, textStatus, xhr) => {
               // *Setting the vehicle's photo:
               $('#vehicle-update-pic').parent().css('background-image', data.photo?'url(' + rest_url + '/media/v/p/'+ data.photo +')':'');

               // *Setting the vehicle's update title:
               $('#vehicle-update-title').val(data.title);

               // *Setting the vehicle's update manufacturer:
               $('#vehicle-update-manufacturer').val(data.manufacturer);

               // *Setting the vehicle's update type:
               $('#vehicle-update-type').val(data.type);

               // *Setting the Vechicle's update year:
               $('#vehicle-update-year').val(data.year);

               // *Setting the Vechicle's update plate:
               $('#vehicle-update-plate').val(data.plate);

               // *Setting the vehicle's update plate:
               $('#vehicle-update-renavam').val(data.renavam);


               // *Getting all MDL textfields:
               let mdl_textfields = document.querySelectorAll('#vehicle-update-section .mdl-js-textfield');
               // *Updating the states of each MDL textfield:
               for(mdl_textfield of mdl_textfields){
                  // *Updating the status:
                  mdl_textfield.MaterialTextfield.updateClasses_();
               }

            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });

         // *Listening to receiva a photo in base64:
         $('#vehicle-update-pic').on('change', (e) => {
            let vehicle_pic_file = document.querySelector('#vehicle-update-pic').files[0];
            file_encoder.asBase64(vehicle_pic_file, res => {
               vehicle_photo_base64 = res;

               // *Showing a preview of a photo to update vehicle:
               $('#vehicle-update-pic').parent().css('background-image', vehicle_photo_base64?'url(' + vehicle_photo_base64 + ')':'');
            });
         });


         // Button to call a function updateVechile and prevent the action default of browser happen
         $('#vehicle-update-form').on('submit', (e) => {
            e.preventDefault();
            // *Open a dialog consent for the user:
            dialogger.open('default-consent', {title: 'vehicle-update-dialog-consent-title', message: 'vehicle-update-dialog-consent-message'}, (dialog, status, params) => {
               // *Switch to verify a status of dialog:
               switch(status){
               // *When the status is positive:
               case dialogger.DIALOG_STATUS_POSITIVE:
               // *Call the function to update a vehicle data:
                  updateVehicle(id, vehicle_photo_base64);
                  break;
               }
            });
         });
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Send it to the index page:
      spa.navigateTo('');
   }
});


 // *Cleaning listernes from this page:
spa.onUnload('vehicle-update', (page) => {
   // *Cleaning the event submit:
   $('#vehicle-update-form').off('submit');
   // *Cleaning the event change:
   $('#vehicle-update-pic').off('change');
   // *Cleaning inputs when the page is left:
   $('#vehicle-update-pic').val('');
   $('#vehicle-update-title').val('');
   $('#vehicle-update-manufacturer').val('');
   $('#vehicle-update-type').val('');
   $('#vehicle-update-year').val('');
   $('#vehicle-update-plate').val('');
   $('#vehicle-update-renavam').val('');
   $('#vehicle-update-pic').parent().css('background-image', '');
});

/**
 * Sends the vehicle update request to REST
 * @param  {number} id                   Id of vehicle
 * @param  {string} vehicle_photo_base64 The base64 encoded image of vehicle
 * @author Willian Conti Rezende
 */
function updateVehicle(id, vehicle_photo_base64){

   // *Getting data of inputs:
   let vehicle_pic = $('#vehicle-update-pic').val();
   let vehicle_title = $('#vehicle-update-title').val();
   let vehicle_manufacturer = $('#vehicle-update-manufacturer').val();
   let vehicle_type = $('#vehicle-update-type').val();
   let vehicle_year = $('#vehicle-update-year').val();
   let vehicle_plate = $('#vehicle-update-plate').val();
   let vehicle_revavam = $('#vehicle-update-renavam').val();

   // *Create a objetct to receiva values to update a vehicle:
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
         // *Showing the snack with the message:
         snack.open('Vehicle updated', snack.TIME_SHORT);
         // *Going to index page:
         spa.navigateTo('');
      })
      .fail((xhr, textStatus, err) => {
         //console.log(xhr.responseJSON);
         // *Declare object to receiva a text to dialog:
         let text = {title: '', message: ''};

         // *Switch to receive error code
         switch(xhr.responseJSON.err_code){
         // *Case when error is duplicate entry:
         case 'ERR_DUPLICATE_FIELD':
            text.title = srm.get('vehicle-update-dialog-error-duplicate-title');
            text.message = srm.get('vehicle-update-dialog-error-duplicate-message');
            break;

         // *Action default of switch:
         default:
            text.title = srm.get('vehicle-update-dialog-error-default-title');
            text.message = srm.get('vehicle-update-dialog-error-default-message');
            break;
         }



         // *Open a dialog consent for the user:
         dialogger.open('default-consent', text, (dialog, status, params) => {

            // *Call the function to update a vehicle data:
               updateVehicle(id, vehicle_photo_base64);
            }
         });

      });
}
