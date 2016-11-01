

// *When the user navigates to this page:
spa.onNavigate('reservations', (page, params) => {

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      request.getReservations(
         {id: '', status: false, from_date: '2016/11/01', to_date: '2016/11/01'},
         {order_by: 'id', order_type: 'asc'})
         .done(data => {
            console.log(data);
         })
         .fail(xhr => {
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
         });
   }
});



// *When the user left this page:
spa.onLeft('reservations', (page) => {

});
