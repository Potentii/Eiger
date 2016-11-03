// *When the page gets loaded:
$(() => {
   // *When the user clicks on their info on drawer:
   $('#drawer-login-info').on('click', e => {
      // *Navigating to user info page:
      spa.navigateTo('user-info', {id: request.retrieveAccessInfo().id});
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
drawer.onOpen(() => {
   // *Getting the user info from database:
   request.getUser(request.retrieveAccessInfo().id)
      .done(data => {

         // *Setting the user's photo:
         $('#drawer-login-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/u/p/'+ data.photo +')':'');

         // *Setting the user's login:
         $('#drawer-login-info-name').text(data.login);

         // *Setting the user's name:
         $('#drawer-login-info-login').text(data.name);

      })
      .fail(xhr => {
         console.log(xhr.responseJSON);
      });
});



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
