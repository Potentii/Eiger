

// *Browsing the index page:
spa.onNavigate('', (page, params) => {
   // *Setting the default availability load chunk size:
   const CHUNK_SIZE = 7;

   // *Getting the user permission:
   let permission = request.retrieveUserPermissions();


   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      // *Getting the previous selected date from cache:
      let selected_date = sessionStorage.getItem('index-selected-date');
      // *Validating the cache data:
      selected_date = /\d{4}-\d{2}-\d{2}/.test(selected_date) ? new Date(selected_date + ' 00:00:00'):undefined;

      // *Declaring the last chunk dates array loaded:
      let dates = [];

      // *Checking the permission to the manage vehicles:
      if(!permission.permissions.manage_vehicles) $('#vehicles-add-fab').hide();

      // *Listing the vehicles:
      request.getVehicles()
         .done(data => {

            // *Building the vehicle's ul:
            let card_ul = $('#vehicles-list');

            // *Checking if the list is empty, adding the empty class if it is:
            if(!data.length) card_ul.addClass('empty');

            // *Iterating and creating the vehicles list:
            data.forEach((vehicle, index) => {

               // *Building the vehicle's li:
               let card_li = $('<li>');
               card_li.attr('data-id', vehicle.id).addClass('card box raised').appendTo(card_ul);

               // *Checking if the vehicle is inactive, adding the inactive class if it is:
               if(!vehicle.active) card_li.addClass('inactive');

               // *Building the vehicle's div:
               let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);

               // *Building and setting the vehicle's photo:
               let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', vehicle.photo?'url('+ rest_url + '/media/v/p/' + vehicle.photo +')':'').appendTo(horizontal_layout_div);

               // *Building the vehicle's div:
               let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

               // *Building and setting the vehicle's title and plate:
               let vehicle_title = $('<span>').addClass('primary').text(vehicle.title + ' - ' + vehicle.plate).appendTo(vertical_layout_div);
               $('<br>').appendTo(vehicle_title);

               // *Building and setting the vehicle's year and manufacturer:
               let vehicle_description = $('<span>').addClass('secondary').text(vehicle.year + ' - ' + vehicle.manufacturer).appendTo(vertical_layout_div);

               // *Building the vehicle's divs:
               let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
               let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);

               // *Building the schedule's balls ul:
               let balls_container = $('<ul>').addClass('schedules flex-horizontal-layout').appendTo(card_li);

               // *Getting the next two date chunks:
               dates = getNextDays(CHUNK_SIZE * 2, selected_date?selected_date:new Date());

               // *Building the schedule's balls and add amount of the schedules number:
               loadChunk(vehicle.id, balls_container, dates)
                  .then(() => {
                     // *Configuring the lazy loading:
                     setupHorizontalLazyLoad(balls_container, () => {
                        // *Getting the last loaded date:
                        let last_date = dates[dates.length-1];
                        // *Getting the next chunk's date:
                        dates = getNextDays(CHUNK_SIZE, addDays(last_date, 1));
                        // *Loading the chunk:
                        loadChunk(vehicle.id, balls_container, dates);
                     });

                     // *Clicking on a schedule's button:
                     balls_container.on('click', 'li', function(){
                        let id = $(this).parent().parent().data('id');
                        let date = $(this).data('date');

                        // *Sending the id and date of the li by parameter:
                        spa.navigateTo('schedules', {id: id, date: date});
                     });
                  });

               // *Hiding the vehicle's photo:
               image_div.css('visibility', 'hidden');
               // *Setting an offset timer:
               setTimeout(() => {
                  // *Showing up the vehicle's photo:
                  image_div.css('visibility', 'visible');
                  // *Playing the inflate animation:
                  anim.inflate(image_div);
               }, index * 125);
            });

            // *Clicking on a vehicle's li:
            card_ul.on('click', 'li > .info', function(){
               let id = $(this).parent().data('id');

               // *Sending the id the li by parameter:
               spa.navigateTo('vehicle-info', {id: id});
            });
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            console.log(xhr.responseJSON);
         });


      // *When a user to click in add button:
      $('#vehicles-add-fab').on('click', function(){
         // *Sending the user's to the vehicle-create page:
         spa.navigateTo('vehicle-create');
      });


      // *When the user clicks on select date FAB:
      $('#vehicles-select-date-fab').on('click', e => {
         // *Opening the date picker dialog, passing the previous selected date:
         dialogger.open('date-picker', {date: selected_date}, (dialog, status, params) => {
            // *Checking the dialog status:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *If the user clicked on OK:
               // *Updating the date variable:
               selected_date = params.date;

               // *Updating the selected date on cache:
               sessionStorage.setItem('index-selected-date', selected_date?df.asMysqlDate(selected_date):undefined);

               // *Getting the next two date chunks:
               dates = getNextDays(CHUNK_SIZE * 2, selected_date?selected_date:new Date());

               // *Getting each vehicle card element:
               $('#vehicles-list > li').each(function(){
                  let card = $(this);
                  // *Getting the vehicle's id:
                  let vehicle_id = card.attr('data-id');
                  // *Getting the balls container:
                  let balls_container = card.children('.schedules');

                  // *Removing the lazy loading:
                  balls_container.off('scroll');

                  // *Cleaning the balls container:
                  balls_container.empty();

                  // *Building the schedule's balls and add amount of the schedules number:
                  loadChunk(vehicle_id, balls_container, dates)
                     .then(() => {
                        // *Configuring the lazy loading:
                        setupHorizontalLazyLoad(balls_container, () => {
                           // *Getting the last loaded date:
                           let last_date = dates[dates.length-1];
                           // *Getting the next chunk's date:
                           dates = getNextDays(CHUNK_SIZE, addDays(last_date, 1));
                           // *Loading the chunk:
                           loadChunk(vehicle_id, balls_container, dates);
                        });
                     });
               });
               break;
            }
         });
      });
   }
});



// *When user left the page:
spa.onLeft('', (page) => {

   // *Removing the list's empty class and the click listener:
   $('#vehicles-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#vehicles-list > li').remove();

   // *Removing the event click:
   $('#vehicles-list .schedules').off('click');
   $('#vehicles-add-fab').off('click');
   $('#vehicles-select-date-fab').off('click');

   // *Showing the 'Add vehicles' FAB:
   $('#vehicles-add-fab').show();
});



/**
 * Loads an availability chunk for a given vehicle
 * @param  {number} vehicle_id      The vehicle's id
 * @param  {jQuery} balls_container The balls container
 * @param  {[Date]} dates           An array of dates
 * @return {Promise}                The resolving promise
 * @author Guilherme Reginaldo Ruella
 */
function loadChunk(vehicle_id, balls_container, dates){
   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Transforming a Date array into a string formatted date array (yyyy-MM-dd):
      dates = dates.map(d => df.asMysqlDate(d));

      // *Retrieving the vehicle's availabilities:
      request.getVehiclesAvailability(vehicle_id, {dates: dates})
         .done(availabilities => {
            // *Getting each availability:
            availabilities.forEach(availability => {
               // *Building the ball, and adding it to the balls list:
               balls_container.append(availabityBallFactory(availability));
            });
            // *Resolving the promise:
            resolve();
         })
         .fail(xhr => {
            console.log(xhr.responseJSON);
            // *Rejecting the promise:
            reject();
         });
   });
}



/**
 * Builds a new ball element
 * @param  {object} availability The availability info
 * @return {jQuery}              The ball element
 * @author Guilherme Reginaldo Ruella
 */
function availabityBallFactory(availability){
   // *Initializing the date object:
   let date = new Date(availability.date + ' 00:00:00');

   // *Building the availability ball element:
   let ball = $('<li>').addClass('vertical-layout').attr('data-date', availability.date);
   $('<span>').addClass('secondary').text(df.asShortDate(date)).appendTo(ball);
   $('<button>').attr('type', 'button').addClass('round').text(availability.schedules).appendTo(ball);

   // *Returning the ball element:
   return ball;
}



/**
 * Sets the lazy loading functionality on a given DOM element
 * @param  {jQuery}   target   The element to apply the lazy loading
 * @param  {function} callback The 'on near bottom' callback
 * @author Guilherme Reginaldo Ruella
 */
function setupHorizontalLazyLoad(target, callback){
   // *Starting the 'on near end' flag:
   var near_end = false;
   // *When the user scrolls this element:
   $(target).on('scroll', function(){
      // *Checking if the scrollbar is near the end:
      if($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth-50) {
         // *If it is:
         // *Checking if the flag is set to false:
         if(!near_end){
            // *If it is:
            // *Changing the flag status:
            near_end = true;
            // *Executing the callback:
            callback();
         }
      } else{
         // *If it's not:
         // *Checking if the flag is true, changing the flag status, if it is:
         if(near_end) near_end = false;
      }
   });
}



/**
* Retrieves an array of days, begining on the given date
* @param  {number} days_quantity Number of days
* @param  {Date} from_date       The start date
* @author Guilherme Reginaldo Ruella
*/
function getNextDays(days_quantity, from_date){
   let vet = [];

   for(var i=0; i<days_quantity; i++) {
      let current_date = from_date ? new Date(from_date) : new Date();
      let next_date_ms = current_date.setDate(current_date.getDate() + i);
      let next_date = new Date(next_date_ms);
      vet.push(next_date);
   }

   return vet;
}



/**
 * Adds hours given a timestamp
 * @param {Date} date     The date object
 * @param {number} hours  The ammount of hours to add
 * @author Guilherme Reginaldo Ruella
 * @return {Date}  The new date with the added hours
 */
function addHours(date, hours){
   date = new Date(date);
   return new Date(date.setHours(date.getHours() + hours));
}


/**
 * Adds days given a timestamp
 * @param {Date} date     The date object
 * @param {number} days  The ammount of days to add
 * @author Guilherme Reginaldo Ruella
 * @return {Date}  The new date with the added days
 */
function addDays(date, days){
   date = new Date(date);
   return new Date(date.setDate(date.getDate() + days));
}
