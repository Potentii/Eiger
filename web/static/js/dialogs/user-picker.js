

// *Browsing the user-picker dialog:
dialogger.onOpen('user-picker', (dialog, params) => {

   // *:
   if(!params || (params.previous_selected_user === null || params.previous_selected_user === undefined)){
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
      return;
   }

   // *Setting the id of the user selected previous:
   let selected_user = params.previous_selected_user;

   // *Building the user's ul:
   let userPicker_ul = $('#user-picker-list');

   // *Listing the users:
   request.getUsers()
      .done((data, textStatus, xhr) => {
         // *:
         data = data.filter(user => user.active);

         // *Iterating and creating the users list:
         data.forEach(user => {

            // *Building the user's li:
            let userPicker_li = $('<li>').attr('data-id', user.id).addClass('row vertical-layout').appendTo(userPicker_ul);

            // *Building and setting the user's name and description:
            $('<span>').addClass('primary').text(user.name).appendTo(userPicker_li);
            $('<span>').addClass('secondary').text(user.login).appendTo(userPicker_li);

            // *Checking if the user selected is exactly equals user.id:
            if(user.id === selected_user){
               // *If this:
               // *Adding a user's li class:
               userPicker_li.addClass('selected');
            } else {
               // *If not:
               // *Removing the user's li class:
               userPicker_li.removeClass('selected');
            }
         });



         // *When a user click in a item list:
         userPicker_ul.on('click', 'li', function(){

            // *Removing all user's li class:
            $('#user-picker-list > .selected').removeClass('selected');

            // *Adding a user's li class:
            $(this).addClass('selected');

            // *Setting the selected_user:
            selected_user = $(this).data('id');
         });
      })
      .fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });

   // *When the user click on a cancel button the dialog:
   $('#user-picker-cancel-button').on('click', e => {
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *When the user click on a ok button the dialog:
   $('#user-picker-ok-button').on('click', e => {
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, {id: selected_user});
   });
});



// *When user left the dialog:
dialogger.onDismiss('user-picker', (dialog, status, params) => {

   // *Wiping the users list:
   $('#user-picker-list').off('click').empty();

   // *Removing the event click:
   $('#user-picker-cancel-button').off('click');
   $('#user-picker-ok-button').off('click');
});
