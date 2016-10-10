

// *Browsing the user-picker dialog:
dialogger.onOpen('user-picker', (dialog, params) => {

   // *Setting the id of the user selected previous:
   let selected_user = params.previous_selected_user;

   // *Building the user's ul:
   let userPicker_ul = $('#user-picker-list');

   // *Listing the users:
   request.getUsers()
      .done((data, textStatus, xhr) => {

         // *Iterating and creating the users list:
         data.forEach((element, index) => {

            // *Building the user's li:
            let userPicker_li = $('<li>').addClass('row vertical-layout').appendTo(userPicker_ul);

            // *Building and setting the user's name and description:
            $('<span>').addClass('primary').text(element.name).appendTo(userPicker_li);
            $('<span>').addClass('secondary').text(element.login).appendTo(userPicker_li);

            // *Checking if the user selected is like element.id:
            if(element.id == selected_user){
               userPicker_li.addClass('selected');
            } else {
               userPicker_li.removeClass('selected');
            }

            // *Clicking on a user's li:
            userPicker_li.on('click', function(){

               $('#user-picker-list > li').removeClass('selected');
               userPicker_li.addClass('selected');

               selected_user = element.id;
            });
         });
      })
      .fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });

   // *Clicking on a cancel button the dialog:
   $('#user-picker-cancel-button').on('click', e => {
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *Clicking on a ok button the dialog:
   $('#user-picker-ok-button').on('click', e => {
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, {id: selected_user});
   });
});


// *When user left the dialog:
dialogger.onDismiss('user-picker', (dialog, status, params) => {

   // *Wiping the users list:
   $('#user-picker-list').empty();

   // *Removing the event click:
   $('#user-picker-cancel-button').off('click');
   $('#user-picker-ok-button').off('click');
});
