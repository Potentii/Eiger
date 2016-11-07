

// *When the user navigate to the users page:
spa.onNavigate('users', (page, params) => {
   // *Getting the user permission:
   let permission = request.retrieveUserPermissions();

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      // *Listing the users:
      request.getUsers()
         .done(data =>{

            // *Building the users's ul:
            let user_ul = $('#users-list');

            // *Checking if the list is empty, adding the empty class if it is:
            if(!data.length) user_ul.addClass('empty');

            // *Iterating and creating the users list:
            data.forEach((user, index) => {

               // *Building the user's li:
               let user_li = $('<li>').attr('data-id', user.id).addClass('row card box raised').appendTo(user_ul);

               // *Checking if the user is inactive, adding the inactive class if it is:
               if(!user.active) user_li.addClass('inactive');

               // *Building the user's div:
               let horizontal_layout_div = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(user_li);

               // *Building and setting the user's photo:
               let img_div = $('<div>').addClass('round-thumbnail size-3').css('background-image', user.photo?'url('+ rest_url + '/media/u/p/' + user.photo +')':'').appendTo(horizontal_layout_div);

               // *Building the user's div:
               let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

               // *Setting the username and login:
               $('<span>').addClass('primary').text(user.name).appendTo(vertical_layout_div);
               $('<span>').addClass('secondary').text(user.login).appendTo(vertical_layout_div);

               // *Hiding the user's photo:
               img_div.css('visibility', 'hidden');
               // *Setting an offset timer:
               setTimeout(() => {
                  // *Showing up the user's photo:
                  img_div.css('visibility', 'visible');
                  // *Playing the inflate animation:
                  anim.inflate(img_div);
               }, index * 125);
            });
   
            // *Checking the permission to the manage users:
            if(!permission.permissions.manage_users){
                $('#users-list').on('click', 'li', function(){
                  let id = $(this).data('id');

                  // *Sending the id of the li by parameter:
                  spa.navigateTo('account-info', {id: id});
                  console.log('Não pode');
               });
            } else{

               // *Clicking on an user:
                $('#users-list').on('click', 'li', function(){
                  let user_id = $(this).data('id');

                  // *Sending the id of the li by parameter:
                  spa.navigateTo('user-info', {id: user_id});
                  console.log('Pode');
               });
            }
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
      $('#users-create-done-fab').on('click', function(){
         // *Sending the user to creation page:
         spa.navigateTo('user-create');
      });
   }
});


// *When the user left the page:
spa.onLeft('users', (page) => {

   // *Removing the list's empty class and the click listener:
   $('#users-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#users-list > li').remove();

   // *Removing the event click from button:
   $('#users-create-done-fab').off('click');
});
