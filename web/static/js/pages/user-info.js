

// *When the user navigate to the user-info page:
spa.onNavigate('user-info', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let user_id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the user:
         request.getUserSensitive(user_id)
            .done(data => {

               // *Checking if the user is active:
               if(data.active === 1){
                  // *If true:
                  // *Showing div user-info-active-true:
                  // *Hiding div user-info-active-false:
                  $('#user-info-active-true').parent().parent('.row').show();
                  $('#user-info-active-false').parent().parent('.row').hide();

                 // *Checking if the user isn't active:
              } else if (data.active === 0) {
                 // *If true:
                 // *Showing div user-info-active-false:
                 // *Hiding div user-info-active-true:
                  $('#user-info-active-false').parent().parent('.row').show();
                  $('#user-info-active-true').parent().parent('.row').hide();
               }

               // *Setting the user's photo:
               $('#user-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/'+ data.photo +')':'');

               // *Setting the user's name:
               $('#user-info-title').text(data.name);

               // *Setting the user's login:
               $('#user-info-description').text(data.login);

               // *Setting the user's email:
               $('#user-info-email').text(data.email);

               // *Setting the user's phone:
               $('#user-info-phone').text(data.phone);

               // *Setting the user's department:
               $('#user-info-department').text(data.department);

               // *Setting the user's pass:
               $('#user-info-pass').text(data.pass);

               // *Setting the user's cpf:
               $('#user-info-cpf').text(data.cpf);

               // *Setting the driver's license:
               $('#user-info-driver-license').text(data.driver_license);

               // *setting the driver's license expiration:
               let license_exp = new Date(data.driver_license_exp);
               $('#user-info-driver-license-exp').text(df.asFullDate(license_exp));

               // *Checking if all permissions is false, showing the permission if it is:
               if(data.permission_schedules === 0 && data.permission_users === 0 && data.permission_vehicles === 0) $('#user-info-permission-none').show();
               // *Checking if one of the permissions is true, hiding the permission if it is:
               if(data.permission_schedules === 1 || data.permission_users === 1 || data.permission_vehicles === 1) $('#user-info-permission-none').hide();

               // *Checking if the permission schedule's is false, hiding the permission if it is:
               if(data.permission_schedules === 0) $('#user-info-permission-schedules').hide();
               // *Checking if the permission schedule's is true, showing the permission if it is:
               else if (data.permission_schedules === 1) $('#user-info-permission-schedules').show();

               // *Checking if the permission users is false, hiding the permission if it is:
               if(data.permission_users === 0) $('#user-info-permission-users').hide();
               // *Checking if the permission users is true, showing the permission if it is:
               else if (data.permission_users === 1) $('#user-info-permission-users').show();

               // *Checking if the permission vehicle's is false, hiding the permission if it is:
               if(data.permission_vehicles === 0) $('#user-info-permission-vehicles').hide();
               // *Checking if the permission vehicle's is true, showing the permission if it is:
               else if (data.permission_vehicles === 1) $('#user-info-permission-vehicles').show();

               // *Setting the user's registred date:
               let create_date = new Date(data.date);
               $('#user-info-date').text(df.asFullDate(create_date));
            })
            .fail(xhr => {
               // *Checking if the request's status is 401, sending the user to the login page if it is:
               if(xhr.status === 401){
                  spa.navigateTo('login');
                  return;
               }
               console.log(xhr.responseJSON);
            });
      }

      // *When a user to click in update button:
      $('#user-info-edit-fab').on('click', function(){
          // *Sending the user's to the user-update page:
          spa.navigateTo('user-update', {id: user_id});
      });
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to users page:
      spa.navigateTo('users');
   }
});



// *When the user left the page:
spa.onUnload('user-info', (page) => {

   // *Removing the event click:
   $('#user-info-edit-fab').off('click');
});
