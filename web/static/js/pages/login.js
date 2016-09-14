spa.onReady(function(){

});

/**
* Salva as chaves de autorização no cache
* @param  {object} data O token e o login do usuario
* @author Ralf Pablo Braga Soares
*/
function saveAuthorization(data){
   // *Salvando o nome 'token' como chave de acesso ao codigo do token no localStorage:
   localStorage.setItem('token', JSON.stringify(data.auth.token));
   // *Salvando o nome 'login' como chave de acesso ao login do usuario no localStorage:e:
   localStorage.setItem('login', JSON.stringify(data.user.login));
}

/**
* Recupera as chaves de autorização no cache
* @return {object} JSON O token e o login do usuario
* @author Ralf Pablo Braga Soares
*/
function getAuthorization(){
   let token = JSON.parse(localStorage.getItem('token'));
   let login = JSON.parse(localStorage.getItem('login'));
   return {token: token, login: login};
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

spa.onNavigate('login', function(page, params){
   console.log('Olá mundo!');
});
