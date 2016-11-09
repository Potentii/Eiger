// *When the page gets loaded:
$(() => {
   // *When the user clicks on their info on drawer:
   $('#drawer-login-info').on('click', e => {
      // *Getting the user permission:
      let permission = request.retrieveUserPermissions();

      // *Checking if the user can manage other users' accounts:
      if(permission && permission.permissions && permission.permissions.manage_users){
         // *If they can:
         // *Navigating to user info page:
         spa.navigateTo('user-info', {id: request.retrieveAccessInfo().id});
      } else{
         // *If they can't:
         // *Navigating to user account page:
         spa.navigateTo('account-info', {id: request.retrieveAccessInfo().id});
      }

      // *Dismissing the navigation drawer:
      drawer.dismiss();
   });


   // *When the user click one of the navigation buttons:
   $('#drawer > .drawer-navigation > button').on('click', e => {
      // *Dismissing the navigation drawer:
      drawer.dismiss();
   });
});



// *When the user opens the drawer:
drawer.onOpen(updateDrawerUserInfo);



/**
 * Updates the user info on drawer
 * @author Dennis Sakaki Fujiki
 */
function updateDrawerUserInfo(){
   // *Getting the user info from database:
   request.getUser(request.retrieveAccessInfo().id)
      .done(data => {

         // *Setting the user's photo:
         $('#drawer-login-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/'+ data.photo +')':'');

         // *Setting the user's name:
         $('#drawer-login-info-name').text(data.name);

         // *Setting the user's login:
         $('#drawer-login-info-login').text(data.login);

      })
      .fail(xhr => {
         console.log(xhr.responseJSON);
      });
}



/**
 * Removes cache and auth and go to login page
 * @author Dennis Sakaki Fujiki, Guilherme Reginaldo Ruella
 */
function logoff(){
   // *Removing user's token from database:
   request.deleteAuth()
      .always(() => {
         // *Removing user data from cache:
         request.clearAccessInfo();
         // *Navigating to login page:
         spa.navigateTo('login');
      })
      .fail(xhr => console.log(xhr.responseJSON));
}
