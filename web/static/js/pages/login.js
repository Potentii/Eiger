spa.onReady(() => {
   spa.navigateTo('auth', {pagina_anterior: spa.getCurrentState().page_name});
});

let auth = getAuthorization();

spa.onNavigate('', function(page, params){
      if(auth.token == null || auth.key == null){
         spa.navigateTo('login');
      }else{

      }
});

spa.onNavigate('login', function(page, params){
   if(auth.token == null || auth.key == null){
      $('#login-form').submit(function(e){
         e.preventDefault();
         // *Recupera o valor do campo 'username':
         let text_username = $('#login-username-in').val();
         // *Recupera o valor do campo 'pass':
         let text_pass = $('#login-pass-in').val();
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
   }else{
      spa.navigateTo('');
   }
});

spa.onNavigate('fallback', function(page, params) {
   if(auth.token == null || auth.key == null){
      spa.navigateTo('login');
   }else{
      spa.navigateTo('fallback');
   }
});




spa.onNavigate('auth', function(page, params) {
   // tokens
   // se ok -> pagina anterior spa.navigateTo(params.pagina_anterior)
   // se nao ok -> login
});

/**
* Salva as chaves de autorização no cache
* @param  {object} data O token e o key do usuario
* @author Ralf Pablo Braga Soares
*/
function saveAuthorization(data){
   // *Salvando com nome 'token' como chave de acesso ao codigo do token no localStorage:
   localStorage.setItem('token', JSON.stringify(data.auth.token));
   // *Salvando o nome 'key' como chave de acesso ao key do usuario no localStorage:e:
   localStorage.setItem('key', JSON.stringify(data.user.login));
}

/**
* Recupera as chaves de autorização no cache
* @return {object} JSON O token e o key do usuario
* @author Ralf Pablo Braga Soares
*/
function getAuthorization(){
   let token = JSON.parse(localStorage.getItem('token'));
   let key = JSON.parse(localStorage.getItem('key'));
   return {token: token, key: key};
}

/**
* Tenta validar acesso
* @author Ralf Pablo Braga Soares
*/
function tryToValidate(success, fail){
   let auth = getAuthorization();
   $.ajax({
      url: 'http://localhost:3000/auth',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.login}
   }).done((data, textStatus, xhr) => {
      success(data.user);
   }).fail((xhr, textStatus, err) => {
      fail("Deu merda!");
   });
}




// *Só para testes:
function requestUsers(){
   let auth = getAuthorization();
   $.ajax({
      url: 'http://localhost:3000/api/v1/users',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {
      console.log(data);
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
