

// *When the user navigates to this page:
spa.onNavigate('email-settings', (page, params) => {

   let settings = {
      smtp_server: 'adasdaada',
      smtp_port: '123',
      user: 'asd',
      password: '123',
      confirmation_send_emails: false,
      confirmation_email_account: 'dasdas@eiger.com',
      confirmation_subject: 'asdasd',
      confirmation_body: 'asas'
   };

   $('#email-settings-smtp-server').val(settings.smtp_server);

   $('#email-settings-smtp-port').val(settings.smtp_port);

   $('#email-settings-user').val(settings.user);

   $('#email-settings-password').val(settings.password);

   $('#email-settings-confirmation-send').prop('checked', settings.confirmation_send_emails?true:false);

   $('#email-settings-confirmation-email').val(settings.confirmation_email_account);

   $('#email-settings-confirmation-subject').val(settings.confirmation_subject);

   $('#email-settings-confirmation-body').text(settings.confirmation_body);

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#email-settings-section');

   // *Updating MDL Textfields:
   mdl_util.updateCheckBoxes('#email-settings-section');
});



// *When the user left this page:
spa.onLeft('email-settings', (page) => {

});
