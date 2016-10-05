// *When navigate the page Schedule Create:
spa.onNavigate('schedule-create', (page, params) => {
   $('#schedule-create-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();
      // *Getting the key and the token:
      let auth = getAuthentication();

      // *Retrieves the values of the fields 'Reason', 'Start Date', 'Start Time', 'End Date' and 'End Time':
      let text_reason = $('#schedule-create-reason').val();
      let date_startdate = $('#schedule-create-start-date').val();
      let time_starttime = $('#schedule-create-start-time').val();
      let date_enddate = $('#schedule-create-end-date').val();
      let time_endtime = $('#schedule-create-end-time').val();
      let start_date_time = date_startdate + ' ' + time_starttime;
      let end_date_time = date_enddate + ' ' + time_endtime;
      let user_id = 1;
      let vehicle_id = 1;
      console.log(start_date_time);
      console.log(end_date_time);
      // *Sends to the server 'Reason', 'Start Date', 'Start Time', 'End Date' and 'End Time' through the method POST:
      $.ajax({
         url: 'http://localhost:3000/api/v1/schedules',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify({id_vehicle_fk: vehicle_id, id_user_fk: user_id, reason: text_reason, start_date: start_date_time, end_date: end_date_time}),
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      }).done((data, textStatus, xhr) => {
         spa.navigateTo('');
         console.log('Schedule Done');
      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
   });
});

spa.onUnload('schedule-create', (page)=> {
   $('#schedule-create-form').off('submit');
});
