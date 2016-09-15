
// * When navigate the page Login:
spa.onNavigate('login', (page, params) => {
   $('#login-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      // *Retrieves the values of the fields 'Username' and 'Password':
      let text_username = $('#login-username-in').val();
      let text_pass = $('#login-pass-in').val();

      // *Sends to the server Username and Password through the method POST:
      $.ajax({
         url: 'http://localhost:3000/auth',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify({login: text_username, pass: text_pass})
      }).done((data, textStatus, xhr) => {
         saveAuthorization(data);
         spa.navigateTo('');
      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
   });
});


// *When navigate the page Auth:
spa.onNavigate('auth', (page, params) => {

   // *Getting the key and the token:
   let auth = getAuthorization();

   // *Checking if the token or key is null:
   if(auth.token == null || auth.key == null) {
      // *If null:
      // *Send it to the login page Login:
      spa.navigateTo('login');
   } else {
      // *If not null:
      // *Send it to the previous page:
      spa.navigateTo(params.pagina_anterior);
   }
});

// * The page loading:
spa.onReady(() => {
   // *Getting name previous page:
   let current_page_name = spa.getCurrentState().page_name;
   // *Checking if that name of the previous page is unlike 'auth':
   if(current_page_name !== 'auth') {
      spa.navigateTo('auth', {pagina_anterior: current_page_name});
   }
});

/**
* Saves the authorization keys in cache
* @param  {object} data The token and the user key
* @author Ralf Pablo Braga Soares
*/
function saveAuthorization(data) {
   // *Setting token as an access key to the token code in cache:
   localStorage.setItem('token', JSON.stringify(data.auth.token));
   // *saving key as an access key to the key code in cache:
   localStorage.setItem('key', JSON.stringify(data.user.login));
}

/**
* Recovers the authorization keys in cache
* @return {object} JSON The token and the user key
* @author Ralf Pablo Braga Soares
*/
function getAuthorization() {
   let token = JSON.parse(localStorage.getItem('token'));
   let key = JSON.parse(localStorage.getItem('key'));
   return {token: token, key: key};
}