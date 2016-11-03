

// *Browsing the reservations-filters dialog:
dialogger.onOpen('reservations-filters', (dialog, params) => {

   // *Setting the schedule id:
   $('#reservations-filters-schedule-id').val(params.schedule_id);

   // *Checking if status is undefined, true or false, if it was set the reservations filter status:
   if(params.status === undefined) $('input:radio[name="reservations-filters-confirmed"][value="both"]').prop('checked', true);
   if(params.status === true) $('input:radio[name="reservations-filters-confirmed"][value="confirmed"]').prop('checked', true);
   if(params.status === false) $('input:radio[name="reservations-filters-confirmed"][value="planned"]').prop('checked', true);

   // *Setting the reservations filter from date:
   $('#reservations-filters-from-date').val(params.from_date);

   // *Setting the reservations filter from date:
   $('#reservations-filters-to-date').val(params.to_date);



   // *When the user click on a cancel button the dialog:
   $('#reservations-filters-cancel-button').on('click', e => {
      // *Assigning status neutral to the dialog:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });



   // *When the user click on a apply button the dialog:
   $('#reservations-filters-apply-button').on('click', e => {

      // *Getting data of inputs:
      let schedule_id_filter = $('#reservations-filters-schedule-id').val();
      let confirmed_filter = undefined;
      let from_date_filter = $('#reservations-filters-from-date').val();
      let to_date_filter = $('#reservations-filters-to-date').val();

      // *Checking if the case was confirmed or planned, if it was set value for true or false:
      switch($("input:radio[name='reservations-filters-confirmed']:checked").val()){
      case 'confirmed':
         confirmed_filter = true;
         break;

      case 'planned':
         confirmed_filter = false;
         break;
      }

      // *Creating a object that receive values to the reservations filter:
      let selected_params = {
         schedule_id: schedule_id_filter?schedule_id_filter:undefined,
         status: confirmed_filter,
         from_date: from_date_filter?from_date_filter:undefined,
         to_date: to_date_filter?to_date_filter:undefined
      };

      // *Assigning status positive to the dialog and passing the filters by parameter::
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, selected_params);
   });
});



// *When user left the dialog:
dialogger.onDismiss('reservations-filters', (dialog, status, params) => {

   // *Cleaning inputs when the page is left:
   $('#reservations-filters-schedule-id').val('');
   $('input:radio[name="reservations-filters-confirmed"][value="both"]').prop('checked', true);
   $('#reservations-filters-from-date').val('');
   $('#reservations-filters-to-date').val('');

   // *Removing the event click:
   $('#reservations-filters-cancel-button').off('click');
   $('#reservations-filters-apply-button').off('click');

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#reservations-filters-form');

   // *Updating MDL Radios:
   mdl_util.updateRadios('#reservations-filters-form');
});
