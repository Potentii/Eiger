

// *When the user navigates to this page:
spa.onNavigate('reservations', (page, params) => {
   // *Getting the user permission:
   let permission = request.retrieveUserPermissions();

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *Checking the permission to the manage schedules:
      if(!permission.permissions.manage_schedules) $('#reservations-add-fab').hide();

      // *Setting the variables for filter use:
      let filters = {
         schedule_id: undefined,
         vehicle_id: undefined,
         user_id: undefined,
         from_date: undefined,
         to_date: undefined,
         status: undefined
      };

      // *Listing all reservations without filter:
      reservationsUtil().updateList(filters);



      // *When a user to click in filter button:
      $('#reservations-filter-fab').on('click', function(){

         // *Opening the vehicle-picker page:
         dialogger.open('reservations-filters', filters, (dialog, status, params_filter) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Updating the filters with actual value selected:
               filters.schedule_id = params_filter.schedule_id;
               filters.from_date = params_filter.from_date;
               filters.to_date = params_filter.to_date;
               filters.status = params_filter.status;
               // *Listing the reservations filtered:
               reservationsUtil().updateList(filters);
               break;
            }
         });
      });



      // *When a user to click in vehicle filter header:
      $('#reservations-vehicle-app-bar').on('click', function(){

         // *Opening the vehicle-picker page:
         dialogger.open('vehicle-picker', {previous_selected_vehicle: filters.vehicle_id}, (dialog, status, vehicle_params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Updating the filters with actual value selected:
               filters.vehicle_id = vehicle_params.id;
               // *Showing the selected vehicle's in app bar:
               reservationsUtil().updateVehicleInfo(filters.vehicle_id);
               // *Listing the reservations filtered:
               reservationsUtil().updateList(filters);
               break;
            }
         });
      });



      // *When a user to click in user filter header:
      $('#reservations-user-app-bar').on('click', function(){

         // *Opening the vehicle-picker page:
         dialogger.open('user-picker', {previous_selected_user: filters.user_id},  (dialog, status, user_params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Updating the filters with actual value selected:
               filters.user_id = user_params.id;
               // *Showing the selected user's in app bar:
               reservationsUtil().updateUserInfo(filters.user_id);
               // *Listing the reservations filtered:
               reservationsUtil().updateList(filters);
               break;
            }
         });
      });



      // *Clicking on a button to clear vehicle:
      $('#reservations-vehicle-clear').on('click', function(){
         // *Setting the vehicle id as undefined:
         filters.vehicle_id = undefined;

         // *Adding the class none-selected to header:
         $('#reservations-vehicle-app-bar').addClass('none-selected');

         // *Listing the reservations filtered:
         reservationsUtil().updateList(filters);
      });



      // *Clicking on a button to clear vehicle:
      $('#reservations-user-clear').on('click', function(){
         // *Setting the user id as undefined:
         filters.user_id = undefined;

         // *Adding the class none-selected to header:
         $('#reservations-user-app-bar').addClass('none-selected');

         // *Listing the reservations filtered:
         reservationsUtil().updateList(filters);
      });



      // *Clicking on a reservations:
      $('#reservations-list').on('click', 'li', function(){
         let id = $(this).data('id');

         // *Sending the id the li by parameter:
         spa.navigateTo('schedule-info', {id: id});
      });



      // *When a user to click in add button:
      $('#reservations-add-fab').on('click', function(){

         // *Sending the user for schedule-create page:
         spa.navigateTo('schedule-create');
      });
   }
});



// *When the user left this page:
spa.onLeft('reservations', (page) => {

   // *Removing the list's empty class and the click listener:
   $('#reservations-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#reservations-list > li').remove();

   // *Adding the class none-selected to header:
   $('#reservations-vehicle-app-bar').addClass('none-selected');
   $('#reservations-user-app-bar').addClass('none-selected');

   // *Removing the event click:
   $('#reservations-filter-fab').off('click');
   $('#reservations-vehicle-app-bar').off('click');
   $('#reservations-user-app-bar').off('click');
   $('#reservations-list').off('click');
   $('#reservations-vehicle-clear').off('click');
   $('#reservations-user-clear').off('click');

   // *Showing the 'Add schedules' FAB:
   $('#reservations-add-fab').show();
});



/**
 * Module that updates vehicle-info, user-info and all reservations
 * @author Ralf Pablo Braga Soares
 */
function reservationsUtil(){



   /**
    * List the reservations filtered or without filters
    * @param  {object} filters object that contains filters
    * @author Ralf Pablo Braga Soares
    */
   function updateList(filters){

      // *Removing all list items:
      $('#reservations-list > li').remove();

      // *Removing the list's empty class:
      $('#reservations-list').removeClass('empty');

      // *Building the reservations list:
      request.getReservations(filters, {order_by: 'start_date', order_type: 'asc'})
         .done(data => {

            // *Building the reservations ul:
            let reservations_ul = $('#reservations-list');

            // *Checking if the list is empty, adding the empty class if it is:
            if(!data.length)  $('#reservations-list').addClass('empty');

            // *Iterating and creating the reservations list:
            data.forEach((reservations) => {

               // *Building the reservations li:
               let reservations_li = $('<li>');
               reservations_li.attr('data-id', reservations.schedule.id).addClass('row card box raised flex-horizontal-layout ' + (reservations.schedule.confirmed?'confirmed':'planned')).appendTo(reservations_ul);

               // *Building the reservations div:
               let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(reservations_li);

               // *Building the reservations vehicle div:
               let horizontal_layout_vehicle = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(vertical_layout_div);

               // *Building and setting the reservations vehicle photos:
               let image_vehicle = $('<div>').addClass('round-thumbnail size-3').css('background-image', reservations.vehicle.photo?'url('+ rest_url + '/media/v/p/' + reservations.vehicle.photo +')':'').appendTo(horizontal_layout_vehicle);

               // *Building the reservations vehicle div:
               let vertical_layout_vehicle = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_vehicle);

               // *Building and setting the reservations vehicle title:
               $('<span>').addClass('primary').text(reservations.vehicle.title + ' - ' + reservations.vehicle.plate).appendTo(vertical_layout_vehicle);

               // *Building and setting the reservations vehicle description:
               $('<span>').addClass('secondary').text(reservations.vehicle.year + ' - ' + reservations.vehicle.manufacturer).appendTo(vertical_layout_vehicle);

               // *Building the reservations user div:
               let horizontal_layout_user = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(vertical_layout_div);

               // *Building and setting the reservations's user photos:
               let image_user = $('<div>').addClass('round-thumbnail size-3').css('background-image', reservations.user.photo?'url('+ rest_url + '/media/u/p/' + reservations.user.photo +')':'').appendTo(horizontal_layout_user);

               // *Building the reservations user div:
               let vertical_layout_user = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_user);

               // *Building and setting the reservations user title:
               $('<span>').addClass('primary').text(reservations.user.name).appendTo(vertical_layout_user);

               // *Building and setting the reservations user description:
               $('<span>').addClass('secondary').text(reservations.user.login).appendTo(vertical_layout_user);

               // *Building and setting the reservations reason:
               $('<span>').addClass('secondary').text(reservations.schedule.reason).appendTo(vertical_layout_div);

               // *Building the reservations schedule duration:
               let schedule_duration_div = $('<div>').addClass('schedule-duration-output').appendTo(reservations_li);

               // *Building and setting the reservations schedule start date:
               let start_date = new Date(reservations.schedule.start_date);
               $('<span>').text(df.asShortDate(start_date)).appendTo(schedule_duration_div);

               // *Building and setting the reservations schedule start time:
               let start_time = new Date(reservations.schedule.start_date);
               $('<span>').addClass('secondary').text(df.asShorterTime(start_time)).appendTo(schedule_duration_div);

               // *Icon between dates:
               $('<i>').addClass('material-icons secondary').text('more_vert').appendTo(schedule_duration_div);

               // *Building and setting the reservations schedule end time:
               let end_time = new Date(reservations.schedule.start_date);
               $('<span>').addClass('secondary').text(df.asShorterTime(end_time)).appendTo(schedule_duration_div);

               // *Building and setting the reservations schedule end date:
               let end_date = new Date(reservations.schedule.end_date);
               $('<span>').text(df.asShortDate(end_date)).appendTo(schedule_duration_div);
            });
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }

            // *Adding the empty class to list:
            $('#reservations-list').addClass('empty');

            let text = {title: '', message: ''};

            // *Checking the error code:
            switch(xhr.responseJSON.err_code){

            // *When the from_date and to_date doesn't forms a valid period
            case 'ERR_INVALID_FILTERS':
               text.title = srm.get('reservations-filters-dialog-error-invalid-filters-title');
               text.message = srm.get('reservations-filters-dialog-error-invalid-filters-message');
               break;

            default:
               text.title = srm.get('reservations-filters-dialog-error-default-title');
               text.message = srm.get('reservations-filters-dialog-error-default-message');
               break;
            }

            // *Opening a dialog notice for the user:
            dialogger.open('default-notice', text);
         });
   }



   /**
    * Update the vehicle info
    * @param  {number} selected_vehicle id the vehicle
    * @author Ralf Pablo Braga Soares
    */
   function updateVehicleInfo(selected_vehicle){

      // *Replacing the vehicle in app bar:
      request.getVehicle(selected_vehicle)
         .done(data => {

            // *Checking if was selected vehicle:
            if(!data.length)  $('#reservations-vehicle-app-bar').removeClass('none-selected');
            if(data.length)  $('#reservations-vehicle-app-bar').addClass('none-selected');

            // *Setting the vehicle's photo:
            $('#reservations-vehicle-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/' + data.photo + ')':'');

            // *Setting the vehicle's title and plate:
            $('#reservations-vehicle-title').text(data.title + " - " + data.plate);

            // *Setting the vehicle's year and manufacturer:
            $('#reservations-vehicle-description').text(data.year + " - " + data.manufacturer);
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



   /**
    * Update the user info
    * @param  {number} selected_user id the user
    * @author Ralf Pablo Braga Soares
    */
   function updateUserInfo(selected_user){

      // *Replacing the user in app bar:
      request.getUser(selected_user)
         .done(data => {

            // *Checking if was selected user:
            if(!data.length)  $('#reservations-user-app-bar').removeClass('none-selected');

            // *Setting the user's photo:
            $('#reservations-user-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/' + data.photo + ')':'');

            // *Setting the User name:
            $('#reservations-user-name').text(data.name);

            // *Setting the user's login:
            $('#reservations-user-login').text(data.login);
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

   // *Exporting this module:
   return {
      updateList: updateList,
      updateVehicleInfo: updateVehicleInfo,
      updateUserInfo: updateUserInfo
   };
}
