

// *When the user navigates to this page:
spa.onNavigate('account-info', (page, params) => {
   // *Checking if the user is authenticated, returning if they're not:
   if(!authenticated) return;

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      // *If id was set:
      let user_id = params.id;

      // *Requesting for user info:
      request.getUser(user_id)
         .done(data => {

            // *Checking if the user is active:
            if(data.active === 1){
               // *If true:
               // *Showing div user-info-active-true:
               // *Hiding div user-info-active-false:
               $('#account-info-active-true').parent().parent('.row').show();
               $('#account-info-active-false').parent().parent('.row').hide();

              // *Checking if the user isn't active:
           } else if (data.active === 0) {
              // *If true:
              // *Showing div user-info-active-false:
              // *Hiding div user-info-active-true:
               $('#account-info-active-false').parent().parent('.row').show();
               $('#account-info-active-true').parent().parent('.row').hide();
            }

            // *Setting the user's photo:
            $('#account-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/'+ data.photo +')':'');

            // *Setting the user's name:
            $('#account-info-title').text(data.name);

            // *Setting the user's login:
            $('#account-info-description').text(data.login);

            // *Setting the user's email:
            $('#account-info-email').text(data.email);

            // *Setting the user's department:
            $('#account-info-department').text(data.department);

            // *Checking if all permissions is false, showing the permission if it is:
            if(data.permission_schedules === 0 && data.permission_users === 0 && data.permission_vehicles === 0) $('#account-info-permission-none').show();
            // *Checking if one of the permissions is true, hiding the permission if it is:
            if(data.permission_schedules === 1 || data.permission_users === 1 || data.permission_vehicles === 1) $('#account-info-permission-none').hide();

            // *Checking if the permission schedule's is false, hiding the permission if it is:
            if(data.permission_schedules === 0) $('#account-info-permission-schedules').hide();
            // *Checking if the permission schedule's is true, showing the permission if it is:
            else if (data.permission_schedules === 1) $('#account-info-permission-schedules').show();

            // *Checking if the permission users is false, hiding the permission if it is:
            if(data.permission_users === 0) $('#account-info-permission-users').hide();
            // *Checking if the permission users is true, showing the permission if it is:
            else if (data.permission_users === 1) $('#account-info-permission-users').show();

            // *Checking if the permission vehicle's is false, hiding the permission if it is:
            if(data.permission_vehicles === 0) $('#account-info-permission-vehicles').hide();
            // *Checking if the permission vehicle's is true, showing the permission if it is:
            else if (data.permission_vehicles === 1) $('#account-info-permission-vehicles').show();

            // *Setting the user's registred date:
            let create_date = new Date(data.date);
            $('#account-info-date').text(df.asFullDate(create_date));
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            console.log(xhr.responseJSON);
         });

   } else {
      // *If not:
      // *Going back 2 times:
      spa.goBack();
      spa.goBack();
   }
});



// *When the user left this page:
spa.onLeft('account-info', (page) => {

});
