

// *When the user navigates to this page:
spa.onNavigate('reservations', (page, params) => {

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      request.getReservations({},{})
         .done(data => {
            console.log(data);
            // *Building the vehicle's ul:
            let reservations_ul = $('#reservations-list');

            // *Checking if the list is empty, adding the empty class if it is:
            if(!data.length) reservations_ul.addClass('empty');

            // *Iterating and creating the vehicles list:
            data.forEach((reservations) => {

               // *Building the reservations li:
               let reservations_li = $('<li>');
               reservations_li.addClass('row card box raised flex-horizontal-layout').appendTo(reservations_ul);

               // *Building the reservations div:
               let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(reservations_li);

               // *Building the reservations vehicle div:
               let horizontal_layout_vehicle = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(vertical_layout_div);

               // *Building and setting the reservations's vehicle photos:
               let image_vehicle = $('<div>').addClass('round-thumbnail size-3').css('background-image', reservations.vehicle.photo?'url('+ rest_url + '/media/v/p/' + reservations.vehicle.photo +')':'').appendTo(horizontal_layout_vehicle);

               // *Building the reservations vehicle div:
               let vertical_layout_vehicle = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_vehicle);

               // *Building and setting the reservations vehicle title:
               $('<span>').addClass('primary').text(reservations.vehicle.title + ' - ' + reservations.vehicle.plate).appendTo(vertical_layout_vehicle);

               // *Building and setting the reservations vehicle description:
               $('<span>').addClass('secondary').text(reservations.vehicle.year + ' - ' + reservations.vehicle.type + ' - ' + reservations.vehicle.manufacturer).appendTo(vertical_layout_vehicle);

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

});
