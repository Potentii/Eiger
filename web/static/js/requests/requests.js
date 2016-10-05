
// *Global Variables:
let rest_url = 'http://localhost:3000';




var request = (function(){



   /**
   * Recovers the authentication keys in cache
   * @return {object} JSON The token and the user key
   * @author Ralf Pablo Braga Soares
   */
   function retrieveAccessCredentials() {
      let token = JSON.parse(localStorage.getItem('token'));
      let key = JSON.parse(localStorage.getItem('key'));
      return {token: token, key: key};
   }



   function getVehicle(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting vehicle:
      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   function getSchedule(id){
      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting schedule:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   function getSchedules(){
      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting all schedules:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   function getVehicles(){
      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting schedule:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   function getUser(id){
      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting user:
      return $.ajax({
         url: rest_url + '/api/v1/users/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }

   // *Exporting this module:
   return {
      getVehicle: getVehicle,
      getVehicles: getVehicles,
      getSchedule: getSchedule,
      getSchedules: getSchedules,
      getUser: getUser
   };
})();
