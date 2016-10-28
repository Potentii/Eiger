
// *When the page gets loaded:
$(() => {
   // *When the user click one of the navigation buttons:
   $('#drawer > .drawer-navigation > button').on('click', e => {
      let info = request.retrieveAccessInfo();
      let info_id = info.id;
      $('#drawer-login-info').on('click', function(){
      spa.navigateTo('user-info', {id: info_id});
   });
      // *Dismissing the navigation drawer:
      drawer.dismiss();
   });
});

// *When the user opens the drawer:
drawer.onOpen(function(){
// *TODO Enviar Requição GET/user/id
   let user_info = request.retrieveAccessInfo();
   let user_info_id = user_info.id;
   request.getUser(user_info_id)
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

function logoff(){
   request.deleteAuth();
   spa.navigateTo('login');
}
