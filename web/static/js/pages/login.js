
// *Global Variables:
// *Variable of authentication:
var authenticated = false;



// *Browsing the login page:
spa.onNavigate('login', (page, params) => {

   // *Building the event to the login form:
   $('#login-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      // *Retrieving the values of the all fields:
      let text_username = $('#login-username-in').val();
      let text_pass = $('#login-pass-in').val();

      // *Saving all values in a object_data:
      let object_data = {login: text_username, pass: text_pass};

      request.postAuth(object_data)
         .done((data, textStatus, xhr) => {

            // *Saving user authentication data:
            saveAuthentication(data);

            // *Setting the variable value for true:
            authenticated = true;

            // *Redirecting the user to index page:
            spa.navigateTo('');
         })
         .fail((xhr, textStatus, err) => {
            console.log(textStatus);
         });
   });
});



// *The page loading:
spa.onReady(() => {

   // *Getting name previous page:
   let current_page_name = spa.getCurrentState().page_name;

   // *Checking if that name of the previous page is unlike 'auth':
   if(current_page_name !== 'auth') {
      spa.navigateTo('auth', {pagina_anterior: current_page_name});
   }
});



// *Browsing the auth page:
spa.onNavigate('auth', (page, params) => {

   // *Getting the key and the token:
   let auth = request.retrieveAccessCredentials();

   // *Checking if the token or key is null:
   if(auth.token == null || auth.key == null) {

      // *If null:
      // *Redirecting the user to login page:
      spa.navigateTo('login');

   } else {

      // *If not null:
      request.getAuth()
         .done((data, textStatus, xhr) => {

            // *Setting the variable value for true:
            authenticated = true;

            // *Redirecting the user to previous page:
            spa.navigateTo(params.pagina_anterior);
         })
         .fail((xhr, textStatus, err) => {

            // *Redirecting the user to login page:
            spa.navigateTo('login');
         });
   }
});



// *Removing the event after unload the page:
spa.onUnload('login', (page, params) => {

   // *Removing the event submit:
   $('#login-form').off('submit');
});



/**
* Saves the authentication keys in cache
* @param  {object} data The token and the user key
* @author Ralf Pablo Braga Soares
*/
function saveAuthentication(data) {

   // *Setting token as an access key to the token code in cache:
   localStorage.setItem('token', JSON.stringify(data.token));

   // *saving key as an access key to the key code in cache:
   localStorage.setItem('key', JSON.stringify(data.user.login));
}
