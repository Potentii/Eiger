// *When this dialog gets opened:
dialogger.onOpen('date-picker', (dialog, params) => {
   // *Getting the given date object:
   let date = params?params.date:undefined;

   // *Checking if the given date is in fact a Date object:
   if(date instanceof Date){
      // *If it is:
      // *Setting the date field value:
      $('#date-picker-date').val(df.asMysqlDate(date));
   } else if(date === undefined){
      // *Or if the date wasn't set:
      // *Cleaning the date field:
      $('#date-picker-date').val('');
   } else{
      // *If none of above:
      // *Throwing an error:
      throw new Error('Incompatible types of parameters');
   }

   // *Updating the MDL textfields:
   mdl_util.updateTextFields('#date-picker-form');


   // *Setting an action for when the user clicks the 'CANCEL' button:
   $('#date-picker-cancel-button').on('click', e => {
      // *Dismissing this dialog as a neutral action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *Setting an action for when the user clicks the 'RESET' button:
   $('#date-picker-reset-button').on('click', e => {
      // *Reseting the fields:
      $('#date-picker-date').val('');
      date = undefined;

      // *Updating the MDL textfields:
      mdl_util.updateTextFields('#date-picker-form');
   });

   // *Setting an action for when the user clicks the 'OK' button:
   $('#date-picker-ok-button').on('click', e => {
      // *Getting the date input value:
      let input_value = $('#date-picker-date').val();
      // *Setting the date object:
      date = input_value?new Date(input_value + ' 00:00:00'):undefined;
      // *Dismissing this dialog as a neutral action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, { date });
   });

});



// *When the user closes this dialog:
dialogger.onDismiss('date-picker', (dialog, status, params) => {
   // *Cleaning the fields:
   $('#date-picker-date').val('');

   // *Cleaning the buttons' listeners:
   $('#default-notice-cancel-button').off('click');
   $('#default-notice-reset-button').off('click');
   $('#default-notice-ok-button').off('click');
});
